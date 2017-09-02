'use strict';

const config = require("../../config");

class BotUtils {

    static createResourceMessage(account) {

        let message = "Here is your resources" + this.createSeperator() + "\n";

        for (let balance of account.balances) {
            let balanceName = balance.title;
            let balanceSymbol = balance.symbol;
            let balanceMessage = "Balance Name : " + balanceName + ", Symbol: " + balanceSymbol;
            message = message + balanceMessage + this.createSeperator() + "Resources\n" + this.createSeperator();
            for (let resource of balance.resources) {

                let resourceMessage = this.createResourceInfoMessage(resource);


                let isOnSimullationMode = config.app.env === "simulation" || config.app.env === "dev";
                if (isOnSimullationMode) {
                    resourceMessage = resourceMessage + "Demo Balance: " + resource.demo_balance + "\n"
                }

                message = message + resourceMessage + this.createSeperator();

            }

        }

        return message;
    }

    static createAlarmMessage(checkResult, resource, alarm) {
        let message = "ATTENTION!!!\n";

        if (checkResult.state === "buy") {
            message += checkResult.symbol + " ask price is " + checkResult.price + "!!!\nIts lower than expected.";

        } else {
            message += checkResult.symbol + " sell price is " + checkResult.price + "!!!\nIts lower than expected.";

        }

        message += this.createSeperator();
        message += this.createInfoForceBuyMessage(checkResult.state);
        message += this.createSeperator();
        message += this.createResourceInfoMessage(resource);
        message += this.createSeperator();
        message += this.createAlarmInfoMessage(alarm);

        return message;
    }

    static createAlarmInfoMessage(alarm) {
        let message = "Alarm ID :" + alarm.id + "\n";
        message += "You can close alarm with /closealarm {alarm_id}";

        return message
    }

    static createInfoForceBuyMessage(state) {
        return "You can force " + state + " with /fbuysell {resource_id}";
    }

    static createResourceInfoMessage(resource) {
        let resourceName = resource.title;
        let resourceId = resource.id;
        let finalState = resource.final_state;
        let finalPrice = resource.final_price;
        let amount = resource.amount;

        return "Title: " + resourceName + "\n" +
            "ID: " + resourceId + "\n" +
            "Final State: " + finalState + "\n" +
            "Final Price: " + finalPrice + "\n" +
            "Amount :" + amount + "\n";
    }

    static createSeperator() {
        return "\n-------------------\n";
    }
}


module.exports = BotUtils;