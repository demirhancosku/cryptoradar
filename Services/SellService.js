/**
 * Created by coskudemirhan on 23/07/2017.
 */

"use strict";
const BaseService = require('./BaseService'),
    PromiseBased = require("./Strategies/PromiseBased"),
    PokerSellBased = require("./Strategies/PokerSellBased"),
    TimeSeries = require("timeseries-analysis");

class SellService extends BaseService {

    constructor() {
        super();

        //Collection of strategies related to sell action
        this.strategies = [];
        this.strategies.push({class_name: 'promiseBasedSellStrategy', class: new PromiseBased("sell")});
        this.strategies.push({class_name: 'pokerBasedSellStrategy', class: new PokerSellBased()});
    }

    update(resource, prices, lastPrice) {

        for (let strategy of this.strategies) {

            if (strategy.class_name === resource.sellStrategy.class_name) {

                strategy.class.update(
                    {
                        resource: resource,
                        timeseries: new TimeSeries.main(TimeSeries.adapter.fromDB(prices, {
                            date: 'created_at',
                            value: 'bid'
                        })),
                        lastPrice: lastPrice

                    });




                return strategy.class.check() || this.checkStopLoss(resource,prices,lastPrice);
            }

        }

    }

    checkStopLoss(resource,prices,lastPrice)
    {
        let stopLossVal = resource.stop_loss_price
        let currentVal = resource.amount * lastPrice
        let picVal = resource.pick_after_buy
        return (Math.abs(picVal - currentVal) >= stopLossVal)

    }

}

module.exports = SellService;