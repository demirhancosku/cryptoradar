/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const config = require("../../config"),
    Sequelize = require("sequelize"),
    Logger = require("../Utils/Logger");

// Default options for Sequelize
let options = {
    dialect: config.db.dialect,
    define: {
        timestamps: true
    },
    host: config.db.server
};

options.logging = (str) => {
    Logger.db(str);
}

//Create orm object
const orm = new Sequelize(config.db.database, config.db.user, config.db.password, options);

const prefix = config.db.prefix;

module.exports = [Sequelize, orm, prefix];