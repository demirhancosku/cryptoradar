const config = require("../../config");

class Indicator {

    constructor() {

    }

    log(str) {
        if (config.app.env === "dev") {

            console.log(str);
        }
    }

    update() {

    }

    calculate(){

    }

    advice(){

    }

}

module.exports = Indicator;