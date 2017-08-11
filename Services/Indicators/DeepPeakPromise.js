
const Indicator = require("./indicator"),
      TimeSeries = require("timeseries-analysis");

class DeepPeakPromise extends Indicator{

    constructor(way) {
        super();

        //To define calculations way, it is peak for sell, deep for buy action
        this.isDeep = way === "deep";
    }

    calculate(){

        //Apply dsp itrend
        this.timeseries.dsp_itrend({
            alpha: this.resource.trend_alpha
        });

        //Apply smooting and getting wave data
        const smoothedSeries = this.timeseries.smoother({period:this.resource.smooth_period}).data.slice(- this.resource.wave_length);
        const selectedArea = new TimeSeries.main(smoothedSeries);

        //Collect smoothed raw values
        const rawValues = selectedArea.data;


        let target;

        //If its buy action we will investigate min, if not max.
        if(this.isDeep){
            target = selectedArea.min();
        }else{
            target = selectedArea.max();
        }

        let key, m;

        //We'll find position of target(min/max) in our raw values
        for(m in rawValues){
            if(rawValues[m][1] === target){
                key = m;
            }
        }

        //If key is near middle of wave(near deep/peak positions) we can say that a peak/deep promised
        return Math.abs(Math.floor(this.resource.wave_length / 2) - key) < Math.round(this.resource.wave_length /4);
    }

    update(data){
        this.resource = data.resource;
        this.timeseries = data.timeseries;


        if(Math.abs(this.resource.wave_length % 2) === 0){
            this.log("Wave Lenght must be odd");
        }
    }

    advice(){
        let advice = this.calculate();
        this.log((this.isDeep? "Deep": "Peak") + " Promise Advice:" + (advice? " possitive" : " negative"));

        return advice;
    }

}

module.exports = DeepPeakPromise;