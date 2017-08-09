/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm] = require('./db');

const Account = orm.define('resources', {
    id: Sequelize.INTEGER,
    balance_id: Sequelize.INTEGER,
    buy_strategy_id: Sequelize.INTEGER,
    sell_strategy_id: Sequelize.INTEGER,
    title: Sequelize.STRING,
    amount: Sequelize.FLOAT,
    status: Sequelize.BOOLEAN,
    final_price: Sequelize.FLOAT,
    final_state: Sequelize.STRING,
    wave_length: Sequelize.INTEGER,
    trend_alpha: Sequelize.FLOAT,
    smooth_period: Sequelize.INTEGER,
    forecast_count: Sequelize.INTEGER,
    sell_margin: Sequelize.FLOAT,
    buy_margin: Sequelize.FLOAT
});

module.exports = Account;
