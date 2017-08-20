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
    default_hashed_special_key: Sequelize.STRING,
    default_hashed_secret_key: Sequelize.STRING,
    default_hashed_username: Sequelize.STRING,
    status: Sequelize.BOOLEAN,
    transaction_fee: Sequelize.FLOAT
},{
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

module.exports = Markets;
