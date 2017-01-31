'use strict';

const restify = require('restify');
const server = restify.createServer();
const handleSimulator = require('../tests/helpers/handler');
const serviceLocator = require('../app/config/di');
const logger = serviceLocator.get('logger');
const errors = require('../app/lib/errors');
const httpStatusCodes = require('http-status');

const doHandle = (event, req, res, next) => {
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

const slugHandler = (req, res, next) => {
    let event = require('../event.json');
    const type = req.params.postType;
    const slug = req.params.postSlug;
    const category = req.params.postCategory;
    const country = req.query.country;
    const language = req.query.language;

    event.pathParameters.resource = 'content';
    event.pathParameters.endpoint = type;
    event.pathParameters.postSlug = slug;
    event.pathParameters.postCategory = category;
    event.queryStringParameters.country = country;
    event.queryStringParameters.language = language;

    doHandle(event, req, res, next);
};

const popularPostsHandler = (req, res, next) => {
    let event = require('../event.json');
    const type = req.params.postType;
    const category = req.params.postCategory;
    const country = req.query.country;
    const language = req.query.language;

    event.pathParameters.resource = 'popular';
    event.pathParameters.endpoint = type;
    event.pathParameters.postCategory = category;
    event.queryStringParameters.country = country;
    event.queryStringParameters.language = language;

    doHandle(event, req, res, next);
};

server.use(restify.queryParser());
server.get('/', (req, res, next) => {
    res.send('Welcome to Carmudi Content Service'); next();
});
server.get('/content/:postType/:postCategory/:postSlug', slugHandler);
server.get('/popular/:postType/:postCategory', popularPostsHandler);
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
