/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm,prefix] = require('./db');
const BalanceModel = require('./balanceModel');
const StrategyModel = require('./strategyModel');


const Resource = orm.define(prefix+'resources', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    balance_id: {
        type: Sequelize.INTEGER,
        references: {
            model: BalanceModel,
            key: 'id',
        }
    },
    buy_strategy_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StrategyModel,
            key: 'id',
        }
    },
    sell_strategy_id: {
        type: Sequelize.INTEGER,
        references: {
            model: StrategyModel,
            key: 'id',
        }
    },
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
    buy_margin: Sequelize.FLOAT,
    short_period: Sequelize.INTEGER,
    long_period: Sequelize.INTEGER
},{
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
        buyStrategy: {
            include: [
                {
                    model: StrategyModel
                }
            ]
        },
        sellStrategy: {
            include: [
                {
                    model: StrategyModel
                }
            ]
        }
    }
});

Resource.belongsTo(StrategyModel, { as: 'buyStrategy', foreignKey: 'buy_strategy_id'});
Resource.belongsTo(StrategyModel, { as: 'sellStrategy', foreignKey: 'sell_strategy_id'});

module.exports = Resource;
