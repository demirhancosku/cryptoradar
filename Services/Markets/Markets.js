/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";

const fs = require('fs'),
    path = require('path');

const routePath = path.join(__dirname);
let markets = [];

fs.readdirSync(routePath).forEach((file) => {
    if (file !== 'Markets.js')
        markets.push({id: file.split("-")[0], class: require("./" + file)});
});




module.exports = markets;