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
    AlarmModel = require('./App/Models/alarmModel'),
    MarketLogModel = require('./App/Models/marketLogModel'),
    StrategyModel = require('./App/Models/strategyModel'),
    PriceModel = require('./App/Models/priceModel'),
    BotUtils = require("./App/Utils/BotUtils"),
    Logger = require('./App/Utils/Logger'),
    AlarmChecker = require('./Services/AlarmChecker');


async function init() {

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
                include: [

                    {
                        model: AlarmModel,
                        as: "alarms",
                        where: {
                            status: 1
                        }

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

    return [accounts, prices]
}

async function router(accounts, prices) {

    for (let account of accounts) {

        for (let balance of account.balances) {

            for (let resource of balance.resources) {


                for (let alarm of resource.alarms) {
                    let alarmChecker = new AlarmChecker(resource,balance, alarm, prices);
                    let checkResult = alarmChecker.check()
                    if(checkResult.result && alarmChecker.shouldSendAlarm())
                    {
                        console.log(new Date(),"Should Send Message ",true)
                        var messageCount = alarm.message_count + 1;
                        Logger.alarm(checkResult,account,alarm,resource)
                        alarm.update({
                            last_message_time: new Date().getTime(),
                            message_count: messageCount
                        });

                    }else
                    {
                        console.log(new Date(),"Should Send Message ",false)
                    }




                }


            }


        }


    }


}

async function run() {

    let run_start = +new Date();


    let [accounts, prices] = await init();


    router(accounts, prices).then(() => {

        let run_completed = +new Date();
        let execution_time = run_completed - run_start;
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