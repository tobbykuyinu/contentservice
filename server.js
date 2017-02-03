'use strict';

const config = require('./app/config/config');
const routes = require('./app/routes/routes');
const handlers = require('./app/routes/handlers');
const formatter = require('./app/lib/formatters/jsend');
const joi = require('joi');
const restify = require('restify');
const versioning = require('restify-url-semver');
const validationMiddleware = require('./app/lib/validation/validation');
const serviceLocator = require('./app/config/di');
const logger = serviceLocator.get('logger');

// Initialize web service
const server = restify.createServer({
    name: config.appName,
    versions: ['1.0.0'],
    formatters: {
        'application/json': formatter
    }
});

// Set API versioning and allow trailing slashes
server.pre(restify.pre.sanitizePath());
server.pre(versioning({ prefix: '/' }));

// Set request handling and parsing
server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

// Validation for request parameters and content type header
server.use(validationMiddleware.paramValidation(joi, logger, {}));
server.use(validationMiddleware.headerValidation(logger));

// Setup routing and error event handling
handlers.setup(server);
routes.setup(server, serviceLocator);

// Start server
server.listen(config.webserver.port, () => {
    logger.info('%s listening at %s', server.name, server.url);

    if (process.env.NODE_ENV === 'development') {
        require('./app/lib/formatters/restify-route-table')(server.router.mounts);
    }
});

// For regression tests purpose
module.exports = server;
