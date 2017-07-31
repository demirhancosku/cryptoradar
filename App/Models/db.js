/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const config = require('../../config'),
    Sequelize = require('sequelize');

const orm = new Sequelize(config.db.database, config.db.user, config.db.password,{
    dialect : 'mysql',
    define: {
        timestamps: false
    }
});

//Quick Migration
orm.query("CREATE TABLE IF NOT EXISTS example (id INTEGER PRIMARY KEY, some_integer INTEGER, some_string TEXT, is_active BOOLEAN, timestamp DATE)");

module.exports = [Sequelize, orm];