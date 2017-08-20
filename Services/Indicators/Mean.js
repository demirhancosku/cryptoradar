const Indicator = require("./Indicator"),
    TimeSeries = require("timeseries-analysis");

class Mean extends Indicator {

    constructor(way) {
        super();

        //To define calculations way; it is up for sell, down for buy action
        this.isUp = way === "up";
    }

    calculate() {

        //We get last wave data for calculating mean
        const selectedArea = new TimeSeries.main(this.timeseries.data.slice(-this.resource.wave_length));

        //Mean calculation
        const mean = selectedArea.mean();

        this.log('Mean: ' + mean);

        //If its a buy action (down) last price must be smaller than mean, if not (up) last price must be bigger than mean
        if (this.isUp) {
            return this.lastPrice > mean;
        } else {
            return this.lastPrice < mean;
        }

    }

    update(data) {

        this.timeseries = data.timeseries;
        this.resource = data.resource;
        this.lastPrice = data.lastPrice;

        this.log('Wave Lenght: ' + this.resource.wave_length);
        this.log('Last Price: ' + this.lastPrice);
    }

    advice() {
        let advice = this.calculate();
        this.log("Last price is " + (this.isUp ? "bigger" : "smaller") + " than mean:" + (advice ? " positive" : " negative"));
        return advice;
    }

}

module.exports = Mean;