const config = require("../../config"),
    Logger = require("../../App/Utils/Logger");

class Indicator {

    constructor() {

    }

    log(str) {
        Logger.info(str);
    }

}

module.exports = Indicator;