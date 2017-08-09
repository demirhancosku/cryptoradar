'use strict';

const config = require('./config'),
    BuyService = require('./Services/BuyService');


//Dummy Data
let data = [21, 20, 17, 16, 14, 13, 11, 10, 9, 10, 11];


//Dummy Resource
let resource = {
    bid:null,
    ask:10,
    amount:0.1,
    wave_length:5
};

const buyService = new BuyService();



buyService.update(resource,data,data[data.length -1]);