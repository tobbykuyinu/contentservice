'use strict';

let RouteHandler = require('./routes/route_handler');

exports.handler = (event, context, callback) => {
    try {
        let routeHandler = new RouteHandler(event, context);
        let responseHandler = require('./routes/response_handler');

        routeHandler.handle()
        .then(response => {
            callback(null, responseHandler(response));
        })
        .catch((error) => callback(error));
    } catch (e) {
        callback(e);
    }
};
