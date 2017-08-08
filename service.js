'use strict';

const config = require('./config'),
    routes = require('./App/Routes'),
    restify = require('restify'),
    jwt = require('jsonwebtoken'),
    ErrorResponse = require('./App/Responses/ErrorResponse'),
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

BuyService.run(resource,data);