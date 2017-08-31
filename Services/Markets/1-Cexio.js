/**
 * Created by coskudemirhan on 11/08/2017.
 */

/**
 *  matveyco/cex.io-api-node.js
 *  https://github.com/matveyco/cex.io-api-node.js
 */

"use strict";


const _https = require("https");
const _crypto = require("crypto");


class Cexio {

    constructor() {
        this._username = '';
        this._api_key = '';
        this._api_secret = '';
        this._nonce = '';
    }

    init(username, api_key, api_secret) {
        this._username = username;
        this._api_key = api_key;
        this._api_secret = api_secret;
        this._nonce = '';
    }

    __signature() //Generate signature
    {
        let string = this._nonce + this._username + this._api_key
        let hmac = _crypto.createHmac('sha256', this._api_secret);
        hmac.setEncoding('hex');
        hmac.write(string);
        hmac.end();
        let temp = hmac.read();
        return temp.toUpperCase()
    }

    __nonce() //Get timestamp as nonce
    {
        this._nonce = Math.round(new Date().getTime() / 1000);
    }


    __post(url, param) //Send post request via requstify
    {
        return new Promise(function (resolve, reject) {

            let post_data = '';
            let body = '';

            for (let key in param) {
                post_data += key + '=' + param[key] + '&'
            }

            if (post_data.length > 2) {
                post_data = post_data.substring(0, post_data.length - 1);
            }
            else {
                post_data = '';
            }

            let request = _https.request({
                hostname: 'cex.io',
                path: url,
                port: 443,
                method: 'POST',
                headers: {
                    'User-Agent': 'cex.io_node.js_api',
                    'Content-Length': post_data.length,
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }, function (res) {
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body += chunk;
                });
                res.on('end', function () {
                    resolve(JSON.parse(body));
                });

                res.on('error', function (e) {
                    reject(e);
                });
            });//Return answer as object in callback

            request.write(post_data);
            request.end();
            return body;
        });

    }

    api_call(method, param, is_private, couple) //Api call
    {

        let url = '/api/' + method + '/';
        //generate uri
        if (couple === undefined) {
            let couple = '';
        } else {
            if (couple.length > 5) {
                url = url + couple + '/';
            }
        }
        if (param === undefined) {
            let param = {};

        } //generate param in needed
        if (is_private === undefined) {
            let is_private = 0
        }
        else {
            if (is_private === 1) {
                this.__nonce();
                param.key = this._api_key;
                param.signature = this.__signature();
                param.nonce = this._nonce;
            }
        }

        return this.__post(url, param);
    }


    ticker(couple) {
        return this.api_call('ticker', {}, 0, couple);
    }

    order_book(couple) {
        return this.api_call('order_book', {}, 0, couple);
    }

    trade_history(since, couple) {
        let param = {};
        param.since = since;
        return this.api_call('trade_history', param, 0, couple);
    }

    balance() {
        let param = {};
        return this.api_call('balance', param, 1, '');
    }

    open_orders(couple) {
        return this.api_call('open_orders', {}, 1, couple);
    }

    cancel_order(id) {
        let param = {};
        param.id = id;
        return this.api_call('cancel_order', param, 1, '');
    }

    place_order(type, amount, price, couple) {
        let param = {};
        param.type = type;
        param.amount = amount;
        param.price = price;
        return this.api_call('place_order', param, 1, couple)
    }

    async buy_sell(type, amount, couple) {
        let param = {};
        param.type = type;
        param.order_type = 'market';
        param.amount = amount;
        let result = await this.api_call('place_order', param, 1, couple);
        return this.normalizer(type, result);
    }

    normalizer(type, data) {

        if (data.error !== undefined) {
            return {'error': true, data: data};
        } else {

            if (type === 'buy') {
                data.amount = data.symbol1Amount / 1000000;
            }

            data.order_id = data.id;
            data.timestamp = time / 1000;

            return data;
        }
    }

    simulate_buy_sell(type, amount, couple, amount2) {

        //TODO: simulate buy/sell will be check
        if (type === 'buy') {
            return {
                'amount': amount2,
                'order_id' : 0
            }
        } else {
            return {
                'amount': amount2,
                'order_id' : 0
            }
        }
    }

    convert(amount, couple) {
        let param = {};
        param.amnt = amount;
        return this.api_call('convert', param, 0, couple)
    }

    async lastPrices(symbol) {
        let result = await this.api_call('ticker', {}, 0, symbol);
        //TODO: response normalizer
        return {ask: result.ask, bid: result.bid}
    }

    multiSymbol(couples) {
        return this.api_call('tickers', {}, 0, couples);
    }
}

module.exports = new Cexio;