/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const [Sequelize,orm] = require('./db');

const Task = orm.define('example', {
    some_integer: Sequelize.INTEGER,
    some_string: Sequelize.STRING,
    is_active: Sequelize.BOOLEAN,
});

module.exports = Example;