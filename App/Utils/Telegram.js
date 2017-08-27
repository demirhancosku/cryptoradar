'use strict';
const telegramBot = require('node-telegram-bot-api');
const config = require('../../config');



class Telegram{

    constructor(account) {
        this.account = account;
        this.bot = new telegramBot(this.account.bot_key, {polling: true});


       

    }

    isAccountTelegramOn(){
        return this.account.telegram_on;
    }

    listenForUser(){
       
        this.bot.onText(/\/(.+)/, (msg, match)=>{

        });
    }

    sendMessage(str){
        if(this.isAccountTelegramOn())
        this.bot.sendMessage(this.account.chat_id, str);


        //console.log(this.account.chat_id);
    }


}

module.exports = Telegram;