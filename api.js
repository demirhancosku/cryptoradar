'use strict';

const config = require('./config'),
    routes = require('./App/Routes'),
    restify = require('restify'),
    jwt = require('jsonwebtoken'),
    ErrorResponse = require('./App/Responses/ErrorResponse'),
    Logger = require("./App/Utils/Logger");


/**
 * Server
 */
global.server = restify.createServer({
    name: config.api.server
});


/**
 * Middleware
 */
global.server.use(restify.plugins.acceptParser(global.server.acceptable));
global.server.use(restify.plugins.queryParser());
global.server.use(restify.plugins.bodyParser());

//JWT Auth Token Middleware
global.server.use((request, response, next) => {

    //We'll define a global user if token satisfy
    global.user = null;
    if (request.query.token !== undefined) {
        try {
            //TODO: the token must be contain users data
            global.user = jwt.verify(request.query.token, config.api.secret_key);
        } catch (err) {
            let res = new ErrorResponse(response);
            res.fill({'message': 'invalid token'});
            res.send();
        }
    }

    next();
});


/**
 * Routes & Controllers
 */
routes.init.example();


global.server.listen(config.api.port, () => {
    Logger.info("server is up");
});

