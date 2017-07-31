/**
 * Created by coskudemirhan on 22/07/2017.
 */

"use strict";

const SuccesResponse = require('../Responses/SuccessResponse');

module.exports = () => {

    /**
     * GET Example LISTS
     */
    global.server.get('/example/lists', async (request, response, next) => {


        /**
         *  TEST RESPONSE
         * @type {SuccessResponse}
         */
        let res = new SuccesResponse(response);
        res.fill({'t':'d'});
        res.send();

        return next();
    })


    /**
     * POST Example LIST
     */
    global.server.post('/example/list', (request, response, next) => {


        return next();
    })



    /**
     * POST example
     */
    global.server.post('/example/add', (request, response, next) => {




        return next();
    })



    /**
     * GET example
     */
    global.server.post('/example/get', (request, response, next) => {



        return next();
    })

}