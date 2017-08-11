
const Indicator = require("./indicator"),
      TimeSeries = require("timeseries-analysis");

class DeepPeakPromise extends Indicator{

    constructor(way) {
        super();

        this.isDeep = way === "deep";
    }

    calculate(){

        this.timeseries.dsp_itrend({
            alpha: this.resource.trend_alpha
        });

        const smoothedSeries = this.timeseries.smoother({period:this.resource.smooth_period}).data.slice(- this.resource.wave_length);
        const selectedArea = new TimeSeries.main(smoothedSeries);

        const rawValues = selectedArea.data;

        let target;

        if(this.isDeep){
            target = selectedArea.min();
        }else{
            target = selectedArea.max();
        }

        let key, m;

        for(m in rawValues){
            if(rawValues[m][1] === target){
                key = m;
            }
        }

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