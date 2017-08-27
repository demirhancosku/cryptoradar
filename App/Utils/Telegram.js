'use strict';
const telegramBot = require('node-telegram-bot-api');
const config = require('../../config');



class Telegram{

    constructor(account,markets) {
        this.account = account;
        this.bot = new telegramBot(this.account.bot_key, {polling: true});
        this.markets = markets 

       

    }

    isAccountTelegramOn(){
        return this.account.telegram_on;
    }

    listenForUser(){
       
        this.bot.onText(/\/(.+)/, (msg, match)=>{
            console.log('Sender:' + msg.from.id);
            console.log('Message:' +  match[1]);
            const resp = match[1].split(' ');
            switch(resp[0]) {
                case "demo" :
                    var self = this;
                    for (let balance of this.account.balances) {
                    
                        let market = this.markets
                        market.class.lastPrices(balance.symbol).then(function(result){
                             
                            
                            for(let resource of balance.resources)
                            {
                                let demoBalance = resource.demo_balance
                                let amount = resource.amount
                                var totalAmount = demoBalance
                                if(resource.final_state == "sell")
                                {
                                    var totalAmount = totalAmount +  amount * result.bid
                                }

                                var message = resource.title+' you have ' + demoBalance + ' demo balance if you sell all you have, you gonna have ' + totalAmount
                                console.log(message)
                                self.sendMessage(message)
                                

                            }




                        });
                       
                        
                    }
                    

            }

        });
    }

    sendMessage(str){
        if(this.isAccountTelegramOn())
        this.bot.sendMessage(this.account.chat_id, str);


        console.log(this.account.chat_id);
    }


}

module.exports = Telegram;