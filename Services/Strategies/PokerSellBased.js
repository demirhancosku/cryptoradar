"use strict";

const Strategy = require("./Strategy"),
    PokerSell = require("../Indicators/PokerSell"),
    Margin = require("../Indicators/Margin"),
    Mean = require("../Indicators/Mean");

class PokerSellBased extends Strategy {

    constructor(action) {
        super();
        this.action = action;
        this.init();
    }

    init() {
        //this.add(new Mean(this.action === "buy" ? "down" : "up"));
        this.add(new PokerSell());
        //this.add(new Margin(this.action));
    }

    update(data) {
        this.updateIndicators(data)
    }

    check() {
        return this.checkAdvices();
    }

}

module.exports = PokerSellBased;