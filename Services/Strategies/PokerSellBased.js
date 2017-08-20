"use strict";

const Strategy = require("./Strategy"),
    PokerSell = require("../Indicators/PokerSell"),
    Mean = require("../Indicators/Mean");

class PokerSellBased extends Strategy {

    constructor(action) {
        super();
        this.action = action;
        this.init();
    }

    init() {
        this.add(new Mean(this.action === "buy" ? "down" : "up"));
        this.add(new PokerSell());
    }

    update(data) {
        this.updateIndicators(data)
    }

    check() {
        return this.checkAdvices();
    }

}

module.exports = PokerSellBased;