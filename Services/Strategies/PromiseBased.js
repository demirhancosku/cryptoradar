"use strict";

const Strategy = require("./Strategy"),
      DeepPeakPromise = require("../Indicators/DeepPeakPromise"),
      Mean = require("../Indicators/Mean");

class PromiseBased extends Strategy{

    constructor(action) {
        super();
        this.action = action;
        this.init();
    }

    init(){
        this.add(new Mean(this.action === "buy" ? "down" : "up"));
        this.add(new DeepPeakPromise(this.action === "buy" ? "deep" : "peak"))
    }

    update(data){
        this.updateIndicators(data)
    }

    check(){
        return this.checkAdvices();
    }

}

module.exports = PromiseBased;