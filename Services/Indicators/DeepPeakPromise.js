
const Indicator = require("./indicator"),
      TimeSeries = require("timeseries-analysis");

class DeepPeakPromise extends Indicator{

    constructor(way) {
        super();

        this.isDeep = way === "deep";
    }

    calculate(){

        const smoothedSeries = this.timeseries.smoother({period:Math.floor(this.waveLength /3)}).data.slice(- this.waveLength);
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

        return Math.abs(Math.floor(this.waveLength / 2) - key) < Math.round(this.waveLength /4);
    }

    update(data){

        if(Math.abs(data.waveLength % 2) === 0){
            this.log("Wave Length must be odd");
        }

        this.timeseries = data.timeseries;
        this.waveLength = data.waveLength;
    }

    advice(){
        let advice = this.calculate();
        this.log((this.isDeep? "Deep": "Peak") + " Promise Advice:" + (advice? " possitive" : " negative"));

        return advice;
    }

}

module.exports = DeepPeakPromise;