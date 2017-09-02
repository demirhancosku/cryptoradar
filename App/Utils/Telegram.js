'use strict';
const telegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const Logger = require('../../App/Utils/Logger');


class Telegram {

    constructor(account, trader) {

        this.account = account;
        this.bot = new telegramBot(this.account.bot_key, {polling: true});
        this.Trader = trader;

    }

    isAccountTelegramOn() {
        return this.account.telegram_on;
    }

    listenForUser() {

        let self = this;

        this.bot.onText(/\/(.+)/, (msg, match) => {

            const chatId = msg.chat.id;
            const resp = match[1].split(' ');

            switch (resp[0]) {
                case "demo":
                    self.Trader.sendDemoBalance(self.account);
                    break;

                case "fbuysell":
                    if (resp.length > 1) {
                        let resourceId = resp[1];
                        self.Trader.forceBuySell(self.account.id, resourceId)
                    }
                    break;

                case "listresources":
                    self.Trader.listResources(self.account.id);
                    break;

                case "closealarm":
                    if (resp.length > 1) {
                        let alarmId = resp[1];
                        self.Trader.closeAlarm(alarmId)
                    }
                    break;

                case "whoami":
                    this.sendMessage(chatId);
                    break
            }
        });
    }

    sendMessage(str) {
        if (this.isAccountTelegramOn())
            this.bot.sendMessage(this.account.chat_id, str);

        //console.log(this.account.chat_id);
    }


}

module.exports = Telegram;