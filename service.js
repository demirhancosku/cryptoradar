'use strict';

const config = require('./config'),
_ = require('underscore'),
Markets = require('./Services/Markets/Markets'),
TraderObject = require('./Trader/Trader'),
AccountsModel = require('./App/Models/accountModel'),
BalanceModel = require('./App/Models/balanceModel'),
ResourceModel = require('./App/Models/resourceModel'),
MarketModel = require('./App/Models/marketModel'),
StrategyModel = require('./App/Models/strategyModel'),
PriceModel = require('./App/Models/priceModel'),
Logger = require('./App/Utils/Logger');



let Trader = new TraderObject();

async function init() {


    //Getting active accounts with balances and their resources and buy/sell strategies
    let accounts = await AccountsModel.scope(['active']).findAll({
        include: [{
            model: BalanceModel,
            as: 'balances',
            where: {
                status: 1
            },
            include: [{
                model: ResourceModel,
                where: {
                    status: 1
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

    //Getting price history, order by timestamp
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


    return [accounts, prices];
}

async function router(accounts, prices) {

    // We will check all active accounts
    for (let account of accounts) {
        Logger.bot(account,Trader)

        //Balances associated with account
        for (let balance of account.balances) {

            // select correct market for balance
            let market = Trader.selectMarket(balance);

            market.transaction_fee = balance.market.transaction_fee;

            // init market from balance market information
            market.class.init(balance.hashed_username, balance.hashed_special_key, balance.hashed_secret_key);

            // get last prices
            //TODO: cache last prices for 10 second
            //TODO: make sure about multiple currency
            let lastPrices = await market.class.lastPrices(balance.symbol);
            let balanceRelatedPrices = _.where(prices, {
                symbol: balance.symbol
            });

            //Resources associated with balances
            for (let resource of balance.resources) {



                switch (resource.final_state) {
                    case 'buy':
                         await Trader.buy(account, market, balance.symbol, resource, balanceRelatedPrices, lastPrices.ask,false);
                        break;

                        case 'sell':
                            await Trader.sell(account, market, balance.symbol, resource, balanceRelatedPrices, lastPrices.bid,false);
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

        Logger.info('This run took ' + execution_time + ' miliseconds, next one will start after ' + (10000 - execution_time) + ' miliseconds');
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


