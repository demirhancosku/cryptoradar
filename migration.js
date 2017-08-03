"use strict";
const [Sequelize, orm] = require("./App/Models/db");

var args = process.argv.slice(2);

async function migrate() {
    if (args[0] !== undefined && args[0] === "remove") {
        await orm.query("DROP TABLE IF EXISTS accounts");
    }

    await orm.query("CREATE TABLE IF NOT EXISTS accounts (id INTEGER PRIMARY KEY, username VARCHAR(255), password VARCHAR(255), is_active BOOLEAN, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");

    return true;
}

migrate().then(() => {
    process.exit();
})

