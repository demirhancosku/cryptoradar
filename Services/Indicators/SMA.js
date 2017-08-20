/**
 * Created by erenyildirim on 13.08.2017.
 */
const Indicator = require("./Indicator"),
    TimeSeries = require("timeseries-analysis");
    const SMA = require("technicalindicators").SMA;

class SMA extends Indicator {

    constructor(operation){
        super();

        //To define calculations way; it is up for sell, down for buy action
        this.isUp = operation === "up";
    };

    calculate(shortPeriod, longPeriod){
        const selectedArea = new TimeSeries.main(this.timeseries.data.slice(-this.resource.wave_length));

        const smashort = SMA.calculate({period: firstPeriod, values: selectedArea.data});
        const smalong = SMA.calculate({period: secondPeriod, values: selectedArea.data});

        if(this.isUp){
            return smashort
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