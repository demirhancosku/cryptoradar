"use strict";
const config = require('./config'),
    _ = require('underscore'),
    Markets = require('./Services/Markets/Markets'),
    MarketModel = require('./App/Models/marketModel'),
    PriceModel = require('./App/Models/priceModel');


setInterval(async function () {

        let marketResults = await MarketModel.findAll({});

        for(let marketResult of marketResults){
            let marketClass = _.findWhere(Markets, {id: marketResult.id.toString()});

            marketClass.class.init(marketResult.default_hashed_username, marketResult.default_hashed_special_key, marketResult.default_hashed_secret_key);

            marketClass.class.multiSymbol('BTC/BCH/ETH/USD').then(function (result) {

                if(marketResult.id == 1) {
                    let BTC_USD = _.findWhere(result.data, {pair: 'BTC:USD'});
                    let BCH_USD = _.findWhere(result.data, {pair: 'BCH:USD'});
                    let ETH_USD = _.findWhere(result.data, {pair: 'ETH:USD'});

                    PriceModel.create({
                        ask: BTC_USD.ask,
                        bid: BTC_USD.bid,
                        symbol: 'BTC/USD',
                        market_id: marketResult.id,
                        timestamp: BTC_USD.timestamp
                    });
                    PriceModel.create({
                        ask: ETH_USD.ask,
                        bid: ETH_USD.bid,
                        symbol: 'ETH/USD',
                        market_id: marketResult.id,
                        timestamp: ETH_USD.timestamp
                    });
                    PriceModel.create({
                        ask: BCH_USD.ask,
                        bid: BCH_USD.bid,
                        symbol: 'BCH/USD',
                        market_id: marketResult.id,
                        timestamp: BCH_USD.timestamp
                    });
                }


                else
                {
                    var IOT_USD = {}
                    IOT_USD.ask = result.ask;
                    IOT_USD.bid = result.bid;
                    IOT_USD.timestamp = result.timestamp;

                    PriceModel.create({
                        ask : IOT_USD.ask,
                        bid : IOT_USD.bid,
                        symbol: 'IOT/USD',
                        market_id : marketResult.id,
                        timestamp : IOT_USD.timestamp
                    });
                }
            });

        }
    },
    10000);

