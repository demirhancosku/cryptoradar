/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";

const BaseResponse = require('./BaseResponse');

class SuccessResponse extends BaseResponse{

    constructor (res) {
        super(res);
        this.setStatus(200);
        this.setError(false);
    }

    fill(data){
        this.setData(data);
    }

}

module.exports = SuccessResponse;

