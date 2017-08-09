/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm] = require('./db');

const Account = orm.define('balances', {
    id: Sequelize.INTEGER,
    account_id: Sequelize.INTEGER,
    market_id: Sequelize.INTEGER,
    amount: Sequelize.FLOAT,
    title: Sequelize.STRING,
    hashed_secret_key: Sequelize.STRING,
    hashed_special_key: Sequelize.STRING,
    status: Sequelize.BOOLEAN
});

module.exports = Account;
