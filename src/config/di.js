'use strict';

let config = require('./config');
let serviceLocator = require('../lib/service_locator');
let AdviceController = require('../controllers/advice');
let AdviceService = require('../services/advice');
let Contentful = require('../lib/contentful');

/**
 * Returns an instance of the logger
 */
serviceLocator.register('logger', () => {
    //here we use console as it is compatible with lambda.
    // Implementation should be changed later to a custom logger functionality
    return console;
});

/**
 * Returns an instance of the advice service
 */
serviceLocator.register('adviceService', (serviceLocator) => {
    let logger = serviceLocator.get('logger');
    let contentful = serviceLocator.get('contentful');
    return new AdviceService(logger, contentful);
});

/**
 * Returns an instance of the advice controller
 */
serviceLocator.register('adviceController', (serviceLocator) => {
    let adviceService = serviceLocator.get('adviceService');
    return new AdviceController(adviceService);
});

/**
 * Returns an instance of the contentful helper library
 */
serviceLocator.register('contentful', () => {
    let logger = serviceLocator.get('logger');
    return new Contentful(config.services.contentful, logger);
});

module.exports = serviceLocator;
