const Indicator = require("./Indicator"),
    _ = require('underscore');

let states = [];

class PokerSell extends Indicator {

    constructor() {
        super();
    }

    calculate() {
        const resource = this.resource;
        const lastPrice = this.lastPrice;
        let advice = false;

        let resourceState = _.findWhere(states, {id: resource.id});

        if (resourceState === undefined) {
            resourceState = {
                id: resource.id,
                before: null,
                last: lastPrice,
                sell_price: resource.final_price + resource.sell_margin
            };

            states.push(resourceState);

        }

        if(resourceState.before !== null && resourceState.before > resourceState.last && resourceState.last > resourceState.sell_price){
            advice = true;
        }

        this.log("Before:" + resourceState.before);
        this.log("Last:" + resourceState.last);
        this.log("Sell:" + resourceState.sell_price);
        this.log("Before price is higher than last:" + (resourceState.before > resourceState.last ? " possitive" : " negative"));
        this.log("Last price is higher than sell price:" + (resourceState.last > resourceState.sell_price ? " possitive" : " negative"));



        if (!advice) {

            states.map(function (res) {

                if (res.id === resource.id) {
                    resourceState.before = res.last;
                    res.before = res.last;

                    res.last = lastPrice;
                    resourceState.last = lastPrice;

                }

                return res;

            });

        }else{
            states = _.without(states, _.findWhere(states, {
                id: resource.id
            }));
        }

        return advice;

    }

    update(data) {
        this.resource = data.resource;
        this.lastPrice = data.lastPrice;
    }

    advice() {
        let advice = this.calculate();
        this.log("Poker Sell Advice:" + (advice ? " possitive" : " negative"));

        return advice;
    }

}

module.exports = PokerSell;