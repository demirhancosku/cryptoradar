'use strict';

const config = require('./config'),
    _ = require('underscore'),
    Markets = require('./Services/Markets/Markets'),
    BuyService = require('./Services/BuyService'),
    SellService = require('./Services/SellService'),
    AccountsModel = require('./App/Models/accountModel'),
    BalanceModel = require('./App/Models/balanceModel'),
    ResourceModel = require('./App/Models/resourceModel'),
    MarketModel = require('./App/Models/marketModel'),
    MarketLogModel = require('./App/Models/marketLogModel'),
    StrategyModel = require('./App/Models/strategyModel'),
    PriceModel = require('./App/Models/priceModel'),
    Logger = require('./App/Utils/Logger');

const buyService = new BuyService();
const sellService = new SellService();

async function init() {

    //Getting active accounts with balances and their resources and buy/sell strategies
    let accounts = await AccountsModel.scope(['active']).findAll({
        include: [
            {
                model: BalanceModel,
                as: 'balances',
                where: {status: 1},
                include: [
                    {
                        model: ResourceModel,
                        where: {status: 1},
                        include: [
                            {
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
                    }]
            }
        ]
    });


    //Getting price history, order by timestamp
    let prices = await PriceModel.findAll({
        limit: 3000,
        order: [
            ['created_at', 'DESC']
        ]
    });

    //Get Plain Objects into prices
    prices = prices.map((price) => price.get({plain: true})).reverse();


    return [accounts, prices];
}

function selectMarket(balance) {

    //Find markey by balance's market_id property
    return _.findWhere(Markets, {id: balance.market_id.toString()});
}

async function router(accounts, prices) {

    // We will check all active accounts
    for (let account of accounts) {


        //Balances associated with account
        for (let balance of account.balances) {

            // select correct market for balance
            let market = selectMarket(balance);

            market.transaction_fee = balance.market.transaction_fee;

            // init market from balance market informations
            market.class.init(balance.hashed_username, balance.hashed_special_key, balance.hashed_secret_key);

            // get last prices
            //TODO: cache last prices for 10 second
            //TODO: make sure about multiple currency
            let lastPrices = await market.class.lastPrices(balance.symbol);
            let balanceRelatedPrices = _.where(prices, {symbol: balance.symbol});

            //Resources associated with balances
            for (let resource of balance.resources) {

                switch (resource.final_state) {
                    case 'buy':
                        await buy(account, market, balance.symbol, resource, balanceRelatedPrices, lastPrices.ask);
                        break;

                    case 'sell':
                        await sell(account, market, balance.symbol, resource, balanceRelatedPrices, lastPrices.bid);
                        break;

                    case 'close':
                        //do nothing
                        break;
                    default:
                }

                //process.exit(0);
            }

            Logger.info(' \n');

        }

    }

}

async function buy(account, market, symbol, resource, prices, last_price) {

    //Get advice for buy action
    let advice = buyService.update(resource, prices, last_price);


    //buy if advice is true
    if (advice) {

        //Calculating buy price
        let buyPrice = parseFloat(resource.amount * last_price);

        // Adding transaction fee
        buyPrice += Math.round(buyPrice * market.transaction_fee / 10) / 100;



        //Send buy request to market
        //to prevent accident buy action
        let result = {'error': true};

        if (config.app.env !== "simulation" && config.app.env !== "dev") {
            result = await market.class.buy_sell('buy', buyPrice.toFixed(2), symbol);
        } else {
            result = market.class.simulate_buy_sell('buy', buyPrice.toFixed(2), symbol, resource.amount);
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
                symbol: symbol
            });

            resource.update({
                final_price: buyPrice,
                final_state: 'sell',
                amount: result.amount
            });

            /**
             *  amount:
             *  order_id:
             *  timestamp:
             */


            Logger.buy('Purchase has been completed. \n Ether Amount:' + resource.amount + "\n" + " Spent " + buyPrice.toFixed(2) + "$ \n" + " Over " + last_price + "$", account);

        }

    }

}

async function sell(account, market, symbol, resource, prices, last_price) {

    //Get advice for sell action
    let advice = sellService.update(resource, prices, last_price);


    //sell if advice is true
    if (advice) {

        //Calculating sell price
        let sellPrice = parseFloat(resource.amount * last_price);

        // Adding transaction fee
        sellPrice += Math.round(sellPrice * market.transaction_fee / 10) / 100;


        //Send sell request to market
        //to prevent accident sell action
        let result = {'error': true};

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
                symbol: symbol
            });

            //TODO: Update resource
            resource.update({
                final_price: sellPrice,
                final_state: 'buy'
            });
            /**
             *  amount:
             *  order_id:
             *  timestamp:
             */


            Logger.sell('Sale has been completed. \n Ether Amount:' + resource.amount + "\n" + " Spent " + sellPrice.toFixed(2) + "$ \n" + " Over " + last_price + "$", account);

        }

    }
}

function stop() {

}

async function run() {
    //run start date for calculating execution time
    let run_start = +new Date();

    //Firstly we will get accounts balances, resources and prices data
    let [accounts, prices] = await init();

    //Then we'll pass all data to Router method. Router method redirects resources to relevant function.
    //If routing completed run again
    router(accounts, prices).then(() => {

        //run stop date
        let run_completed = +new Date();

        //We will execute run again after 10 second including this one's execution time
        let execution_time = run_completed - run_start;

        Logger.info('This run took ' + execution_time + ' miliseconds, next one will start after ' + (10000 - execution_time ) + ' miliseconds');
        setTimeout(() => {
            Logger.info('\n');
            try {
                run();
            } catch (error) {
                console.error(error)
            }
        }, Math.abs(10000 - execution_time));
    });

}


run();


