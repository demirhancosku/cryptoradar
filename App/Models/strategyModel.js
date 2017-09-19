/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm,prefix] = require('./db');

const Strategies = orm.define(prefix+'strategies', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    title: Sequelize.STRING,
    class_name: Sequelize.STRING,

},{
    updatedAt: 'updated_at',
    createdAt: 'created_at'
});

module.exports = Strategies;
