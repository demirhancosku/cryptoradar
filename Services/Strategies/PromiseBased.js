"use strict";

const Strategy = require("./Strategy"),
    DeepPeakPromise = require("../Indicators/DeepPeakPromise"),
    Margin = require("../Indicators/Margin"),
    Mean = require("../Indicators/Mean"),
    SMA = require("../Indicators/SMA");

class PromiseBased extends Strategy {

    constructor(action) {
        super();
        this.action = action;
        this.init();
    }

    init() {
        this.add(new Mean(this.action === "buy" ? "down" : "up"));
        this.add(new SMA(this.action === "buy" ? "buy" : "sell"));
        this.add(new DeepPeakPromise(this.action === "buy" ? "deep" : "peak"));

        if (this.action !== "buy") {
            this.add(new Margin(this.action));
        }
    }

    update(data) {
        this.updateIndicators(data)
    }

    check() {
        return this.checkAdvices();
    }

}

module.exports = PromiseBased;