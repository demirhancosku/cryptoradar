/**
 * Created by coskudemirhan on 23/07/2017.
 */

"use strict";
const BaseService = require('./BaseService'),
      PromiseBased = require("./Strategies/PromiseBased"),
      TimeSeries = require("timeseries-analysis");

class BuyService extends BaseService {

    constructor() {
        super();
    }

    static run(resource,data) {

       const promiseBasedBuyStrategy = new PromiseBased("buy");

        promiseBasedBuyStrategy.update(
            {
                timeseries: new TimeSeries.main(TimeSeries.adapter.fromArray(data)),
                waveLength: resource.wave_length,
                lastPrice : data[data.length -1]

            });

        console.log(promiseBasedBuyStrategy.check());
    }

}

module.exports = BuyService;