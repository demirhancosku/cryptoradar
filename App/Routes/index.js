/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";
const fs = require('fs'),
    path = require('path');


let init = {}

const routePath = path.join(__dirname);

fs.readdirSync(routePath).forEach(function (file) {
    if(file !== 'index.js')
        init[file.replace('Routes.js','')] = require("./" + file);
});


module.exports = {init:init};