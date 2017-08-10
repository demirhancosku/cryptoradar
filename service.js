'use strict';

const config = require('./config'),
    BuyService = require('./Services/BuyService'),
    AccountsModel = require('./App/Models/accountModel'),
    BalanceModel = require('./App/Models/balanceModel'),
    ResourceModel = require('./App/Models/resourceModel'),
    StrategyModel = require('./App/Models/strategyModel'),
    PriceModel = require('./App/Models/priceModel');

const buyService = new BuyService();

async function init() {

    //Getting active accounts with balances and their resources and strategies
    let accounts = await AccountsModel.scope(['balances', 'active']).findAll({
        include: [
            {
                model: BalanceModel,
                where: {status: 1},
                include: [{
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
                    ]
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


async function router(accounts, prices) {

    // We will check all active accounts
    for (let account of accounts) {

        //Balances associated with account
        for(let balance of account.balances){

            //Resources associated with balances
            for(let resource of balance.resources){

                switch (resource.final_state) {
                    case 'open':

                        buyService.update(resource, prices, prices[prices.length - 1]);

                        break;
                    case 'close':
                        //do nothing
                        break;
                    default:
                }

               process.exit(0);
            }

        }

    }

}


async function run() {
    //firstly we will get accounts balances, resources and prices data
    let [accounts,  prices] = await init();

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


