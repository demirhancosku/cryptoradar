/**
 * Created by coskudemirhan on 23/07/2017.
 */

"use strict";
const BaseService = require('./BaseService'),
    bcrypt = require('bcrypt'),
    worker = 'example-worker';

class ExampleService extends BaseService {

    constructor() {
        super(worker);
    }

    static someAlgo() {

    }

    init() {


    }

}

module.exports = ExampleService;