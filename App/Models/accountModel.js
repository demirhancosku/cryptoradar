/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize, orm] = require('./db');
const BalanceModel = require('./balanceModel');

const Account = orm.define('accounts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    is_active: Sequelize.BOOLEAN,
}, {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
        balances: {
            include: [
                {
                    model: BalanceModel,
                    where: {
                        status: 1
                    }
                }
            ]
        },
        active: {
            where: {
                is_active: 1
            }
        }
    }
});

Account.hasMany(BalanceModel, {foreignKey: 'account_id'});
module.exports = Account;