'use strict';

let RouteHandler = require('./app/routes/route_handler');
const responseHandler = require('./app/routes/response_handler');

exports.handler = (event, context, callback) => {
    try {
        const routeHandler = new RouteHandler(event, context);

        routeHandler.handle()
        .then(response => {
            callback(null, responseHandler(response));
        })
        .catch((error) => callback(null, responseHandler(error)));
    } catch (e) {
        callback(null, responseHandler(e));
    }
};
