'use strict';

const config = require('./config'),
    _ = require('underscore'),
    Markets = require('./Services/Markets/Markets'),
    BuyService = require('./Services/BuyService'),
    AccountsModel = require('./App/Models/accountModel'),
    BalanceModel = require('./App/Models/balanceModel'),
    ResourceModel = require('./App/Models/resourceModel'),
    MarketModel = require('./App/Models/marketModel'),
    StrategyModel = require('./App/Models/strategyModel'),
    PriceModel = require('./App/Models/priceModel');

const buyService = new BuyService();

async function init() {

    //Getting active accounts with balances and their resources and strategies
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
                                as: 'buyStrategy'
                            },
                            {
                                model: StrategyModel,
                                as: 'sellStrategy'
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


    //getting price history order by timestamps
    let prices = await PriceModel.scope('ether').findAll({
        limit: 10000,
        order: [
            ['timestamp', 'DESC']
        ]
    });

    //Get Plain Objects into prices
    prices = prices.map((price) => price.get({plain: true}));

    return [accounts, prices];
}

function selectMarket(balance) {
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
            let lastPrices = await market.class.lastPrices(balance.symbol);

            //Resources associated with balances
            for (let resource of balance.resources) {

                switch (resource.final_state) {
                    case 'buy':
                        await buy(market, balance.symbol, resource, prices, lastPrices.ask);
                        break;

                    case 'sell':

                        break;

                    case 'close':
                        //do nothing
                        break;
                    default:
                }

                //process.exit(0);
            }

        }

    }

}

async function buy(market, symbol, resource, prices, last_price) {

    let advice = buyService.update(resource, prices, last_price);

    console.log(advice);
    //to prevent spontaneously buy action
    advice = false;
    if(advice){

        // calculating buy price
        let buyPrice = parseFloat(resource.amount * last_price);

        // Adding transaction fee
        buyPrice += Math.round(buyPrice * market.transaction_fee / 10) / 100;


        //send buy request to market
        let result = await market.class.buy_sell('buy', buyPrice.toFixed(2), symbol);

        if (result.error !== undefined) {
            console.log('ERROR');
            console.log(result);

            console.log(resource.title + ' kaynağı ile ' + last_price + '$ dan ' + resource.amount + ' ETH almaya çalışırken bir sorun oluştu.');

        } else {
            console.log(result);
            console.log('buy', buyPrice.toFixed(2), symbol);


            //TODO: Market log
            //TODO: Update resource
            /**
             *  amount: result.symbol1Amount / 1000000
             *  order_id: result.id
             *  timestamp: result.time / 1000
             */

        }

    }

}

function sell() {

}

function stop() {

}

async function run() {
    //firstly we will get accounts balances, resources and prices data
    let [accounts, prices] = await init();

    // then we'll pass all data to Router method. Router method redirects resources to relevant function.
    await router(accounts, prices);

}


setInterval(() => {
    run()
        .then(() => {
        })
        .catch((err) => {
            console.log(err);
        });
}, 5000);


