/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize, orm, prefix] = require('./db');
const AccountModel = require('./accountModel');
const MarketModel = require('./marketModel');
const ResourceModel = require('./resourceModel');

const Balance = orm.define(prefix+'balances', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    account_id: {
        type: Sequelize.INTEGER,
        references: {
            model: AccountModel,
            key: 'id',
        }
    },
    market_id: {
        type: Sequelize.INTEGER,
        references: {
            model: MarketModel,
            key: 'id',
        }
    },
    amount: Sequelize.FLOAT,
    title: Sequelize.STRING,
    symbol: Sequelize.STRING,
    hashed_username: Sequelize.STRING,
    hashed_secret_key: Sequelize.STRING,
    hashed_special_key: Sequelize.STRING,
    status: Sequelize.BOOLEAN
}, {
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
        resources: {
            include: [
                {
                    model: ResourceModel,
                    where: {
                        status: 1
                    }
                }
            ]
        },
        market: {
            include: [
                {
                    model: MarketModel,
                }
            ]
        }
    }
});

Balance.hasMany(ResourceModel, {foreignKey: 'balance_id', as: 'resources'});
Balance.belongsTo(MarketModel, {foreignKey: 'market_id', as: 'market'});

module.exports = Balance;
