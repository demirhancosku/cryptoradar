/**
 * Created by kaganozupek on 01/09/2017.
 */

"use strict";
const [Sequelize, orm, prefix] = require('./db');
const ResourceModel = require('./resourceModel');

const Alarm = orm.define(prefix+'alarms',{
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
    max: Sequelize.FLOAT,
    min : Sequelize.FLOAT,
    title: Sequelize.STRING,
    status : Sequelize.INTEGER,
    last_message_time : Sequelize.DOUBLE,
    message_count : Sequelize.INTEGER,
    next_message_time : Sequelize.DOUBLE
},{
    updatedAt: 'updated_at',
    createdAt: 'created_at'
})


module.exports = Alarm;