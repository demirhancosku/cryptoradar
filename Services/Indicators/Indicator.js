const config = require("../../config");

class Indicator {

    constructor() {

    }

    log(str) {
        if (config.app.env === "dev") {

            console.log(str);
        }
    }

}

module.exports = Indicator;