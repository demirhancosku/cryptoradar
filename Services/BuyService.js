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
        this.promiseBasedBuyStrategy = new PromiseBased("buy");
    }

    update(resource,data,lastPrice){
        this.promiseBasedBuyStrategy.update(
            {
                timeseries: new TimeSeries.main(TimeSeries.adapter.fromArray(data)),
                waveLength: resource.wave_length,
                lastPrice : lastPrice

            });

        console.log(this.promiseBasedBuyStrategy.check());
    }

}

module.exports = BuyService;