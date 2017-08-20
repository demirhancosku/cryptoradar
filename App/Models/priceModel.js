/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm,prefix] = require('./db');

const Prices = orm.define(prefix+'prices', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    symbol: Sequelize.STRING,
    timestamp: Sequelize.INTEGER,
    market_id: Sequelize.INTEGER,
    ask: Sequelize.FLOAT,
    bid: Sequelize.FLOAT,
},{
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
        ether: {
            where: {
                symbol: 'ETH/USD'
            }
        },
        bitcoin: {
            where: {
                symbol: 'BTC/USD'
            }
        },
        bitcoincash: {
            where: {
                symbol: 'BCH/USD'
            }
        }
    }
});

module.exports = Prices;
