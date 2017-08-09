/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm] = require('./db');

const Prices = orm.define('prices', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    symbol: Sequelize.STRING,
    timestamp: Sequelize.INTEGER,
    ask: Sequelize.FLOAT,
    bid: Sequelize.FLOAT,
},{
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    scopes: {
        ether: {
            where: {
                symbol: 'ETH'
            }
        },
        bitcoin: {
            where: {
                symbol: 'BTC'
            }
        }
    }
});

module.exports = Prices;
