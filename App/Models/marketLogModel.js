/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize, orm, prefix] = require('./db');
const MarketModel = require('./marketModel');
const ResourceModel = require('./resourceModel');

const Balance = orm.define(prefix+'market_logs', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    resource_id: {
        type: Sequelize.INTEGER,
        references: {
            model: ResourceModel,
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
    order_id: Sequelize.INTEGER,
    amount: Sequelize.FLOAT,
    symbol: Sequelize.STRING,
    value: Sequelize.FLOAT
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

Balance.belongsTo(ResourceModel, {foreignKey: 'resource_id', as: 'resources'});
Balance.belongsTo(MarketModel, {foreignKey: 'market_id', as: 'market'});

module.exports = Balance;
