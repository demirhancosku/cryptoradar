"use strict";
const config = require("../../config"),
    colors = require("colors/safe");


class Logger{


    isDev(){
        return config.app.env === "dev";
    }

    static error(str){

    }

    static db(str){

    }

    static buy(str){

    }

    static sell(str){

    }

    static info(str){

    }
}