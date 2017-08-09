/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm] = require('./db');

const Account = orm.define('markets', {
    id: Sequelize.INTEGER,
    title: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    transaction_fee: Sequelize.FLOAT
});

module.exports = Account;
