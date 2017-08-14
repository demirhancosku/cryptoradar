"use strict";

const config = require("../../config");


class Simulation {

    static isSimulation() {
        return config.app.env === "simulation";
    }

    static buy(market) {
        //TODO: Fill markets normalizer with correct data
        if(this.isSimulation()){

        }
    }

    static sell(market) {
        //TODO: Fill markets normalizer with correct data
        if(this.isSimulation()){

        }
    }
}

module.exports = Simulation;