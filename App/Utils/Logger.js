"use strict";
const config = require("../../config"),
    Colors = require("colors/safe"),
    Telegram = require("./Telegram");


class Logger{

    static bot(account){

        if(this.bots === undefined)
            this.bots = [];

        if(this.bots[account.id] === undefined){
            this.bots[account.id] = new Telegram(account);
            //this.bots[account.id].listenForUser();
        }

        return this.bots[account.id];
    }

    static isDev(){
        return config.app.env === "dev";
    }

    static error(str,account){

        if(this.isDev())
            console.log(str);


        //TODO: File log will be here

        //
        this.bot(account).sendMessage(str);
    }

    static db(str,account){
        if(this.isDev())
            console.log(Colors.yellow(str));
    }

    static buy(str,account){
        if(this.isDev())
            console.log(Colors.green(str));

        this.bot(account).sendMessage(str);
    }

    static sell(str,account){
        if(this.isDev())
            console.log(Colors.red(str));

        this.bot(account).sendMessage(str);
    }

    static info(str){
        if(this.isDev())
            console.log(Colors.blue(str));

    }
}

module.exports = Logger;