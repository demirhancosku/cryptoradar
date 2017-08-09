/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm] = require('./db');

const Account = orm.define('strategies', {
    id: Sequelize.INTEGER,
    title: Sequelize.STRING,
    class_name: Sequelize.STRING,
});

module.exports = Account;
