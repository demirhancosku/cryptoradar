'use strict';
const config = require('../config'),
    _ = require('underscore'),
    Markets = require('../Services/Markets/Markets'),
    BuyService = require('../Services/BuyService'),
    SellService = require('../Services/SellService'),
    AccountsModel = require('../App/Models/accountModel'),
    BalanceModel = require('../App/Models/balanceModel'),
    ResourceModel = require('../App/Models/resourceModel'),
    AlarmModel = require('../App/Models/alarmModel'),
    MarketModel = require('../App/Models/marketModel'),
    MarketLogModel = require('../App/Models/marketLogModel'),
    StrategyModel = require('../App/Models/strategyModel'),
    PriceModel = require('../App/Models/priceModel'),
    BotUtils = require("../App/Utils/BotUtils"),
    Logger = require('../App/Utils/Logger');


class Trader {


    constructor() {
        this.buyService = new BuyService();
        this.sellService = new SellService();


    }


    async buy(account, market, symbol, resource, prices, last_price, forced) {


        var isOnSimullationMode = config.app.env == "simulation" || config.app.env == "dev";
        var amount = resource.amount
        if (isOnSimullationMode) {
            amount = this.calculateSimulationAmount(resource, last_price)
        }


        resource.update({
            amount: amount

        })
        //Get advice for buy action
        let advice = this.buyService.update(resource, prices, last_price);


        //deneme
        //buy if advice is true
        if (advice || forced) {


            //Calculating buy price
            let buyPrice = parseFloat(amount * last_price);

            // Adding transaction fee
            buyPrice += Math.round(buyPrice * market.transaction_fee / 10) / 100;


            //Send buy request to market
            //to prevent accident buy action
            let result = {
                'error': true
            };

            if (config.app.env !== "simulation" && config.app.env !== "dev") {
                result = await market.class.buy_sell('buy', buyPrice.toFixed(2), symbol);
            } else {
                result = market.class.simulate_buy_sell('buy', buyPrice.toFixed(2), symbol, amount);
            }


            //If buy request returns error
            if (result.error !== undefined) {
                Logger.error("Something went wrong during the purchase.", account, result);
            } else {

                MarketLogModel.create({
                    resource_id: resource.id,
                    market_id: market.id,
                    order_id: result.order_id,
                    amount: result.amount,
                    value: buyPrice,
                    symbol: symbol,
                    action: "buy"
                });


                var totalBalance = resource.demo_balance;
                var newBalance = totalBalance - buyPrice


                resource.update({
                    final_price: last_price,
                    final_state: 'sell',
                    amount: result.amount,
                    demo_balance: newBalance
                });


                /**
                 *  amount:
                 *  order_id:
                 *  timestamp:
                 */


                Logger.buy(resource.title + 'Purchase has been completed. \n Amount:' + resource.amount + "\n" + " Spent " + buyPrice.toFixed(2) + "$ \n" + " Over " + last_price + "$", account);

            }

        }

    }

    async sell(account, market, symbol, resource, prices, last_price, forced) {

        //Get advice for sell action
        let advice = this.sellService.update(resource, prices, last_price);


        //sell if advice is true
        if (advice || forced) {

            //Calculating sell price
            let sellPrice = parseFloat(resource.amount * last_price);

            // Adding transaction fee
            sellPrice += Math.round(sellPrice * market.transaction_fee / 10) / 100;


            //Send sell request to market
            //to prevent accident sell action
            let result = {
                'error': true
            };

            if (config.app.env !== "simulation" && config.app.env !== "dev") {
                result = await market.class.buy_sell('sell', resource.amount, symbol);
            } else {
                result = market.class.simulate_buy_sell('sell', resource.amount, symbol, resource.amount);
            }


            //If sell request return error
            if (result.error !== undefined) {
                Logger.error("Something went wrong during the sale.", account, result);
            } else {


                MarketLogModel.create({
                    resource_id: resource.id,
                    market_id: market.id,
                    order_id: result.order_id,
                    amount: resource.amount,
                    value: sellPrice,
                    symbol: symbol,
                    action: "sell"
                });


                var totalBalance = resource.demo_balance;
                var newBalance = totalBalance + sellPrice

                //TODO: Update resource
                resource.update({
                    final_price: last_price,
                    final_state: 'buy',
                    demo_balance: newBalance
                });
                /**
                 *  amount:
                 *  order_id:
                 *  timestamp:
                 */


                Logger.sell(resource.title + ' Sale has been completed. \n Amount:' + resource.amount + "\n" + " Spent " + sellPrice.toFixed(2) + "$ \n" + " Over " + last_price + "$", account);

            }

        }
    }


    async sendDemoBalance(account) {

        for (let balance of account.balances) {
            var market = this.selectMarket(balance)
            market.class.lastPrices(balance.symbol).then(function (result) {


                for (let resource of balance.resources) {
                    let demoBalance = resource.demo_balance
                    let amount = resource.amount
                    var totalAmount = demoBalance
                    if (resource.final_state == "sell") {
                         totalAmount = totalAmount + amount * result.bid
                    }

                    var message = resource.title + ' you have ' + demoBalance + ' demo balance if you sell all you have, you gonna have ' + totalAmount
                    // console.log(message)
                    console.log(message)
                    Logger.bot(account).sendMessage(message)


                }


            });


        }

    }


    calculateSimulationAmount(resource, last_price) {
        return (resource.demo_balance) / last_price
    }


    async forceBuySell(accountId, resourceId) {
        let accounts = await AccountsModel.scope(['active']).findAll({

            where: {
                id: accountId
            },

            include: [{
                model: BalanceModel,
                as: 'balances',
                where: {
                    status: 1
                },
                include: [{
                    model: ResourceModel,
                    where: {
                        status: 1,
                        id: resourceId
                    },
                    include: [{
                        model: StrategyModel,
                        as: 'buyStrategy',
                        foreignKey: 'buy_strategy_id'
                    },
                        {
                            model: StrategyModel,
                            as: 'sellStrategy',
                            foreignKey: 'sell_strategy_id'
                        }
                    ],
                    as: 'resources'
                },
                    {
                        model: MarketModel,
                        as: 'market'
                    }
                ]
            }]
        });
        let account = accounts[0]

        if (account == null || account.balances == null)
            return;

        let balance = account.balances[0]
        if (balance == null || balance.resources == null)
            return
        let resource = balance.resources[0]

        if (resource == null)
            return;

        let prices = await PriceModel.findAll({
            limit: 3000,
            order: [
                ['created_at', 'DESC']
            ]
        });

        //Get Plain Objects into prices
        prices = prices.map((price) => price.get({
            plain: true
        })).reverse();


        let market = this.selectMarket(balance);

        market.transaction_fee = balance.market.transaction_fee;

        // init market from balance market information
        market.class.init(balance.hashed_username, balance.hashed_special_key, balance.hashed_secret_key);

        let lastPrices = await market.class.lastPrices(balance.symbol);
        let balanceRelatedPrices = _.where(prices, {
            symbol: balance.symbol
        });
        if (resource.final_state == "buy")
            await this.buy(account, market, balance.symbol, resource, balanceRelatedPrices, lastPrices.ask, true);
        else if (resource.final_state == "sell")
            await this.sell(account, market, balance.symbol, resource, balanceRelatedPrices, lastPrices.bid, false);

    }

    async closeAlarm(alarmId)
    {
        //TODO check alarm blongs to user
        let alarms = AlarmModel.findAll({
            where:{
                id : alarmId
            }
        })

        let alarm = alarms[0]
        alarm.update({
            status:0
        })
    }


    async listResources(accountId) {
        let accounts = await AccountsModel.scope(['active']).findAll({

            where: {
                id: accountId
            },

            include: [{
                model: BalanceModel,
                as: 'balances',
                where: {
                    status: 1
                },
                include: [{
                    model: ResourceModel,
                    where: {
                        status: 1,
                    },
                    as: "resources"

                }
                ]
            }]
        });

        let account = accounts[0]
        if (account == null)
            return;
        let message = BotUtils.createResourceMessage(account)
        Logger.bot(account).sendMessage(message)


    }

    selectMarket(balance) {

        //Find market by balance's market_id property
        return _.findWhere(Markets, {
            id: balance.market_id.toString()
        });
    }


}

module.exports = Trader