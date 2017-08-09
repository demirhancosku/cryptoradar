'use strict';

const config = require('./config'),
    BuyService = require('./Services/BuyService'),
    AccountsModel = require('./App/Models/accountModel'),
    PriceModel = require('./App/Models/priceModel');

const buyService = new BuyService();

async function init() {

    //Getting active accounts with balances
    let accounts = await AccountsModel.scope(['balances', 'active']).findAll();


    //Collect all balances in a array
    let balances = [];

    for (let account of accounts) {
        balances = balances.concat(account.balances);
    }


    //collect all resources releted with balances
    let resources = [];

    for (let balance of balances) {
        resources = resources.concat(await balance.getResources());
    }

    for (let i in resources) {
        resources[i].buyStrategy = await resources[i].getBuyStrategy();
        resources[i].sellStrategy = await resources[i].getSellStrategy();
    }

    console.log(resources);

    //getting price history order by timestamps
    const prices = await PriceModel.scope('ether').findAll({
        limit: 10000,
        order: [
            ['timestamp', 'DESC']
        ]
    });

    return [accounts, balances, resources, prices];
}


async function router(accounts, balances, resources, prices) {

    for(let resource of resources){

        switch(resource.final_state) {
            case 'open':

                buyService.update(resource, prices, prices[prices.length - 1]);

                break;
            case 'close':
                //do nothing
                break;
            default:
        }
    }

}


async function run() {
    //firstly we will get accountsi balances, resources and prices data
    let [accounts, balances, resources, prices] = await init();

    // then we'll pass all data to Router method. Router method redirects resources to relevant function.
    await router(accounts, balances, resources, prices);

}

run().then(() => {


    process.exit(0);
}).catch((err) => {
    console.log(err);
    process.exit(0);
});

