const Indicator = require("./indicator"),
    TimeSeries = require("timeseries-analysis");

class Mean extends Indicator {

    constructor(way) {
        super();

        this.isUp = way === "up";
    }

    calculate() {

        const selectedArea = new TimeSeries.main(this.timeseries.data.slice(-this.resource.wave_length * 2));

        const mean = selectedArea.mean();

        this.log('Mean: ' + mean);

        if (this.isUp) {
            return this.lastPrice > mean;
        } else {
            return this.lastPrice < mean;
        }

    }

    update(data) {

        if (Math.abs(data.waveLength % 2) === 0) {
            this.log("Wave Lenght must be odd");
        }

        this.timeseries = data.timeseries;
        this.resource = data.resource;
        this.lastPrice = data.lastPrice;

        this.log('Wave Lenght: ' + this.resource.wave_length);
        this.log('Last Price: ' + this.lastPrice);
    }

    advice() {
        let advice = this.calculate();
        this.log("Last price is " + (this.isUp ? "bigger" : "smaller") + " than mean:" + (advice ? " possitive" : " negative"));
        return advice;
    }

}

module.exports = Mean;