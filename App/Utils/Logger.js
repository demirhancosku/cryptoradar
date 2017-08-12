"use strict";
const config = require("../../config"),
    colors = require("colors/safe"),
    Telegram = require("./Telegram");


class Logger{


    bot(account){
        //TODO: account base cache will be here
        return new Telegram(account);
    }

    isDev(){
        return config.app.env === "dev";
    }

    static error(str,account){

        if(this.isDev())
            console.log(str);


        //TODO: File log will be here

        this.bot(account).sendMessage(str);
    }

    static db(str,account){

    }

    static buy(str,account){
        this.bot(account).sendMessage(str);
    }

    static sell(str,account){
        this.bot(account).sendMessage(str);
    }

    static info(str,account){
        this.bot(account).sendMessage(str);
    }
}