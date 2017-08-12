const Indicator = require("./Indicator");

class Margin extends Indicator {

    constructor(operation) {
        super();

        //To define operation is sell or not?
        this.isSell = operation === "sell";
    }

    calculate() {
        if (this.isSell) {
            return this.resource.sell_margin + this.resource.final_price < this.lastPrice;
        } else {
            return this.resource.final_price - this.resource.buy_margin > this.lastPrice;
        }

    }



    update(data) {
        this.lastPrice = data.lastPrice;
        this.resource = data.resource;
    }

    advice() {
        let advice = this.calculate();
        this.log("Final Price is: " + this.resource.final_price + " \nLast price has correct " + (this.isSell ? "sell" : "buy") + " margin from resource:" + (advice ? " possitive" : " negative"));
        return advice;
    }

}

module.exports = Margin;