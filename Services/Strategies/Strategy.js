class Strategy {

    constructor() {
        this.indicators = [];
    }

    add(indicator){
        this.indicators.push(indicator);
    }

    updateIndicators(data){

        for(let indicator of this.indicators){
            indicator.update(data);
        }
    }

    checkAdvices(){

        let flag = true;

        for(let indicator of this.indicators){
            if(!indicator.advice()){
                flag = false;
            }
        }

        return flag;
    }
}

module.exports = Strategy