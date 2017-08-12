const telegramBot = require('node-telegram-bot-api');

class Telegram{

    constructor(account) {
        this.account = account;
        this.bot = new telegramBot(this.account.bot_key, {polling: true});
    }

    isAccountTelegramOn(){
        return this.account.telegram_on;
    }
    sendMessage(str){
        if(this.isAccountTelegramOn())
        this.bot.sendMessage(this.account.chat_id, str);
    }


}

module.exports = Telegram;