'use strict';

const restify = require('restify');
const server = restify.createServer();
const handleSimulator = require('../tests/helpers/handler');
const serviceLocator = require('../src/config/di');
const logger = serviceLocator.get('logger');
const errors = require('../src/lib/errors');
const httpStatusCodes = require('http-status');

const slugHandler = (req, res, next) => {
    let event = require('../event.json');
    const type = req.params.postType;
    const slug = req.params.postSlug;

    event.pathParameters.postType = type;
    event.pathParameters.postSlug = slug;

    handleSimulator.handle(event)
    .then(response => {
        for (let i in response.headers) {
            if (response.headers.hasOwnProperty(i)) {
                res.header(i, response.headers[i]);
            }
        }

        response.body = JSON.parse(response.body);
        res.send(response.statusCode, response.body);
    })
    .catch(e => {
        logger.info(`Failed to simulate lambda call: ${e.message}`);
        res.send(500, new errors.InternalServerError('Internal server error'));
    })
    .then(next);
};

server.get('/content/:postType/:postSlug', slugHandler);
server.on('uncaughtException', (req, res, route, error) => {
    // tell developers what went wrong
    logger.error(error.stack);

    res.send(
        httpStatusCodes.INTERNAL_SERVER_ERROR,
        new errors.InternalServerError('Internal Server Error')
    );
});

server.listen(8082, () => {
    logger.info('%s listening at %s', server.name, server.url);
});
