'use strict';

const routes = require('./routes');
const errors = require('../lib/errors');

class RouteHandler {

    /**
     * Routes class for handling routing
     * @constructor
     * @param {object} event
     * @param {object} context
     */
    constructor(event, context) {
        this.event = event;
        this.context = context;
    }

    /**
     * Function to handle endpoint calls
     * @returns {Promise}
     */
    handle() {
        //@todo: somehow get this from the parameters passed
        let resource = 'content';
        let endpoint  = this.event.pathParameters.postType;
        return this.call(resource, endpoint);
    }

    /**
     * Function to call specific handler
     * @param resource
     * @param endpoint
     * @returns {Promise}
     */
    call(resource, endpoint) {
        if (routes[resource] === undefined || routes[resource][endpoint] === undefined) {
            return Promise.reject(new errors.MethodNotImplemented('Method not implemented'));
        }

        return routes[resource][endpoint](this.event, this.context);
    }
}

module.exports = RouteHandler;
