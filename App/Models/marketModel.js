/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm,prefix] = require('./db');

const Markets = orm.define(prefix+'markets', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    title: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    transaction_fee: Sequelize.FLOAT
},{
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

module.exports = Markets;
