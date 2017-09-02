"use strict";
const _ = require('underscore');
const ALARM_MESSAGE_COUNT = 3;
const TIME_BETWEN_MESSAGES = 1000 * 20;
const MAX_TIME_BETWEN_MESSAGES = 1000 * 120;

class AlarmChecker {


    constructor(resourceObject, balanceObject, alarmObject, pricesObject) {
        this.alarm = alarmObject;
        this.prices = pricesObject;
        this.resource = resourceObject;
        this.balance = balanceObject;

    }


    shouldSendAlarm() {

        var result = this.alarm.last_message_time == null || this.alarm.next_message_time < new Date().getTime();
        console.log(Math.abs(new Date().getTime() - this.alarm.next_message_time), result)
        if (result) {
            this.setNextMessageTime()
        }

        return result

    }


    setNextMessageTime() {
        var nextTime = new Date().getTime()
        var messageCount = this.alarm.message_count + 1
        if (messageCount % ALARM_MESSAGE_COUNT !== 0) {
            nextTime += TIME_BETWEN_MESSAGES
        } else {
            nextTime += MAX_TIME_BETWEN_MESSAGES
        }
        this.alarm.update({
            next_message_time: nextTime
        })
    }

    check() {
        let balanceRelatedPrices = _.where(this.prices, {
            symbol: this.balance.symbol
        });
        let lastPrice = balanceRelatedPrices[balanceRelatedPrices.length - 1];
        if (this.resource.final_state === "buy") {
            let alarmPrice = this.alarm.min;
            let askPrice = lastPrice.ask;
            if (askPrice < alarmPrice) {
                //Buy Alarm

                return {

                    result: true,
                    price: askPrice,
                    alarmPrice: alarmPrice,
                    state: "buy",
                    symbol: this.balance.symbol
                }
            } else {
                return {
                    result: false
                }
            }

        } else if (this.resource.final_state === "sell") {
            let alarmPrice = this.alarm.max;
            let bidPrice = lastPrice.bid;
            if (bidPrice < alarmPrice) {
                //Sell Alarm
                return {

                    result: true,
                    price: bidPrice,
                    alarmPrice: alarmPrice,
                    state: "sell",
                    symbol: this.balance.symbol
                }
            } else {
                return {
                    result: false
                }
            }

        } else {
            return {
                result: false
            }
        }
    }


}


module.exports = AlarmChecker