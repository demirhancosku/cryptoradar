"use strict";

const config = require("../../config");


class Simulation {

    static isSimulation() {
        return config.app.env === "simulation";
    }

    static buy() {

        if(this.isSimulation()){

        }
    }

    static sell() {
    }
}

module.exports = Simulation;