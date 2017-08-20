/**
 * Created by erenyildirim on 13.08.2017.
 */
const Indicator = require("./Indicator");
TimeSeries = require("timeseries-analysis");
const SimpleMA = require("technicalindicators").SMA;
Logger = require('./App/Utils/Logger');

class SMA extends Indicator {

    constructor(operation){
        super();

        //To define calculations way; it is up for sell, down for buy action
        this.isUp = operation === "up";
    };

    calculate(shortPeriod, longPeriod){
        if(firstPeriod < (this.resource.wave_length - 3) && secondPeriod < (this.resource.wave_length - 2)) {
            const currentArea = new TimeSeries.main(this.timeseries.data.slice(-this.resource.wave_length));
            const pastArea = currentArea.data.slice(-this.resource.wave_length, -1);
            const pastPastArea = currentArea.data.slice(-this.resource.wave_length, -2);

            const currentSMAShort = SimpleMA.calculate({period: firstPeriod, values: currentArea});
            const currentSMALong = SimpleMA.calculate({period: firstPeriod, values: currentArea});

            const pastSMAShort = SimpleMA.calculate({period: firstPeriod, values: pastArea});
            const pastSMALong = SimpleMA.calculate({period: secondPeriod, values: pastArea});

            if(pastSMAShort === pastSMALong){
                const pastPastSMAShort = SimpleMA.calculate({period: firstPeriod, values: pastPastArea});
                const pastPastSMALong = SimpleMA.calculate({period: secondPeriod, values: pastPastArea});

                if(pastPastSMAShort > pastPastSMALong){
                    if(this.isUp){
                        if(currentSMAShort < currentSMALong){
                            return true;
                        }
                    }else {
                        return false;
                    }
                } else if(pastPastSMAShort < pastPastSMALong){
                    if(!this.isUp){
                        if(currentSMAShort > currentSMALong){
                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            }
        } else {
            Logger.error("The 'Resource Wave Length' is shorter than the period you want to analyze'");
            return false;
        }



    }

    update(data){
        this.timeseries = data.timeseries;
        this.resource = data.resource;
        this.lastPrice = data.lastPrice;

        this.log('Wave Length: ' + this.resource.wave_length);
        this.log('Last Price: ' + this.lastPrice);
    }

    advice(){

    }



}