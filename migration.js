"use strict";
const [Sequelize, orm, prefix] = require("./App/Models/db");

var args = process.argv.slice(2);

async function migrate() {
    if (args[0] !== undefined && args[0] === "remove") {
        await orm.query("DROP TABLE IF EXISTS "+prefix+"market_logs");
        await orm.query("DROP TABLE IF EXISTS "+prefix+"resources");
        await orm.query("DROP TABLE IF EXISTS "+prefix+"strategies");
        await orm.query("DROP TABLE IF EXISTS "+prefix+"balances");
        await orm.query("DROP TABLE IF EXISTS "+prefix+"markets");
        await orm.query("DROP TABLE IF EXISTS "+prefix+"accounts");

        await orm.query("DROP TABLE IF EXISTS "+prefix+"prices");
    }

    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"accounts (id INTEGER PRIMARY KEY AUTO_INCREMENT, username VARCHAR(255), password VARCHAR(255), is_active BOOLEAN, telegram_on BOOLEAN, bot_key VARCHAR(255), chat_id INTEGER, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"markets (id INTEGER PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255), status BOOLEAN, transaction_fee FLOAT, default_hashed_username VARCHAR(255), default_hashed_secret_key VARCHAR(255), default_special_key VARCHAR(255), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"balances (id INTEGER PRIMARY KEY AUTO_INCREMENT, account_id INTEGER(11), market_id INTEGER(11), amount FLOAT, title VARCHAR(255), symbol VARCHAR(255), hashed_username VARCHAR(255), hashed_secret_key VARCHAR(255), hashed_special_key VARCHAR(255), status BOOLEAN, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY(account_id) REFERENCES "+prefix+"accounts (id), FOREIGN KEY(market_id) REFERENCES "+prefix+"markets (id))");
    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"strategies (id INTEGER PRIMARY KEY AUTO_INCREMENT, title VARCHAR(255), class_name VARCHAR(255), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");
    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"resources (id INTEGER PRIMARY KEY AUTO_INCREMENT, balance_id INTEGER(11), buy_strategy_id INTEGER(11), sell_strategy_id INTEGER(11), title VARCHAR(255), amount FLOAT, status BOOLEAN, final_price FLOAT, final_state VARCHAR(255) , wave_length INTEGER, trend_alpha FLOAT, smooth_period INTEGER, forecast_count INTEGER, sell_margin FLOAT, buy_margin FLOAT,  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY(balance_id) REFERENCES "+prefix+"balances (id), FOREIGN KEY(sell_strategy_id) REFERENCES "+prefix+"strategies (id), FOREIGN KEY(buy_strategy_id) REFERENCES "+prefix+"strategies (id))");
    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"market_logs (id INTEGER PRIMARY KEY AUTO_INCREMENT, resource_id INTEGER(11), market_id INTEGER(11), order_id INTEGER(11), amount FLOAT, symbol VARCHAR(255), value FLOAT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, FOREIGN KEY(resource_id) REFERENCES "+prefix+"resources (id), FOREIGN KEY(market_id) REFERENCES "+prefix+"markets (id))");

    await orm.query("CREATE TABLE IF NOT EXISTS "+prefix+"prices (id INTEGER PRIMARY KEY AUTO_INCREMENT, symbol VARCHAR(255), market_id INTEGER(11), ask FLOAT, bid FLOAT(11), timestamp INTEGER, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)");

    return true;
}

migrate()
    .then(() => {
        console.log('Migration completed');
        process.exit();
    })
    .catch((err) => {
        console.log(err);
        process.exit();
    })

