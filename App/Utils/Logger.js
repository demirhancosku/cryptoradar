"use strict";
const config = require("../../config"),
    Colors = require("colors/safe"),
    Telegram = require("./Telegram");


class Logger {

    static bot(account) {

        if (this.bots === undefined)
            this.bots = [];

        if (this.bots[account.id] === undefined) {
            this.bots[account.id] = new Telegram(account);
            //this.bots[account.id].listenForUser();
        }

        return this.bots[account.id];
    }

    static isDev() {
        return config.app.env === "dev";
    }

    static error(str, account) {

        if (this.isDev())
            console.log(str);


        //TODO: File log will be here

        //
        this.bot(account).sendMessage(str);
    }

    static db(str, account) {
        this.devlog(str, 'yellow');

    }

    static buy(str, account) {
        this.devlog(str, 'green');

        this.bot(account).sendMessage(str);
    }

    static sell(str, account) {
        this.devlog(str, 'red');

        this.bot(account).sendMessage(str);
    }

    static info(str) {
        this.devlog(str, 'blue');

    }

    static devlog(str, color) {
        if (this.isDev())
            console.log(Colors[color](str));
    }
}

module.exports = Logger;