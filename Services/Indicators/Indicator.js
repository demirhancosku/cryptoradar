const config = require("../../config"),
    colors = require("colors/safe");

class Indicator {

    constructor() {

    }

    log(str) {
        if (config.app.env === "dev") {

            console.log(colors.blue(str));
        }
    }

}

module.exports = Indicator;