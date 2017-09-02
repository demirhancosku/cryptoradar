"use strict";
const config = require("../../config"),
    Colors = require("colors/safe"),
    BotUtils = require("./BotUtils"),
    Telegram = require("./Telegram");



class Logger {

    static bot(account,trader) {

        if (this.bots === undefined)
            this.bots = [];

        if (this.bots[account.id] === undefined) {
           
            this.bots[account.id] = new Telegram(account,trader);
            this.bots[account.id].listenForUser();
        }

        return this.bots[account.id];
    }


    static error(str, account, data) {

        this.devlog(str, 'red');
        this.devlog(data, 'pink');

        this.simulationlog(str, 'red');

        //TODO: File log will be here

        this.bot(account).sendMessage(str);
    }

    static db(str, account) {
        this.devlog(str, 'yellow');
    }

    static buy(str, account) {
        this.devlog(str, 'green');
        this.simulationlog(str, 'green');
        this.bot(account).sendMessage(str);
    }

    static sell(str, account) {
        this.devlog(str, 'red');
        this.simulationlog(str, 'red');
        this.bot(account).sendMessage(str);
    }




    static info(str) {
        this.devlog(str, 'blue');
        this.simulationlog(str, 'blue');

    }

    static botInfo(str) {
        this.devlog(str, 'red');
        this.simulationlog(str, 'red');

    }

    static setPrices(prices)
    {
        this.prices = prices
    }



    static devlog(str, color) {
        if (config.app.env === "dev")
            console.log(Colors[color](str));
    }

    static simulationlog(str, color) {
        if (config.app.env === "simulation")
            console.log(Colors[color](str));
    }

    static alarm(checkResult,account,alarm,resource) {

        this.bot(account).sendMessage(BotUtils.createAlarmMessage(checkResult,resource,alarm));
    }


   
}

module.exports = Logger;