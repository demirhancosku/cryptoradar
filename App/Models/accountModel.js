/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize, orm, prefix] = require('./db');
const BalanceModel = require('./balanceModel');

const Account = orm.define(prefix+'accounts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    is_active: Sequelize.BOOLEAN,
    telegram_on: Sequelize.BOOLEAN,
    bot_key: Sequelize.STRING,
    chat_id: Sequelize.INTEGER,
}, {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
        active: {
            where: {
                is_active: 1
            }
        }
    }
});

Account.hasMany(BalanceModel, {foreignKey: 'account_id', as: 'balances'});
module.exports = Account;