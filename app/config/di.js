'use strict';

const config = require('./config');
const serviceLocator = require('../lib/service_locator');
const PostContentController = require('../controllers/post_content');
const PostContentService = require('../services/post_content');
const RecommendationService = require('../services/recommendation');
const PopularPostsService = require('../services/popular_posts');
const Contentful = require('../lib/contentful');
const CarmudiApiSearch = require('../lib/carmudi_api_search');
const GoogleAnalytics = require('../lib/google_analytics');
const logger = require('../lib/logger');

/**
 * Returns an instance of the logger
 */
serviceLocator.register('logger', () => {
    return logger.create(config.logging);
});

/**
 * Returns an instance of the post content service
 */
serviceLocator.register('postContentService', (serviceLocator) => {
    let logger = serviceLocator.get('logger');
    let contentful = serviceLocator.get('contentful');
    return new PostContentService(logger, contentful);
});

/**
 * Returns an instance of the recommendation service
 */
serviceLocator.register('recommendationService', (serviceLocator) => {
    let logger = serviceLocator.get('logger');
    let apiSearch = serviceLocator.get('carmudiApiSearch');
    return new RecommendationService(logger, apiSearch);
});

/**
 * Returns an instance of the popular posts service
 */
serviceLocator.register('popularPostsService', (serviceLocator) => {
    let logger = serviceLocator.get('logger');
    let googleAnalytics = serviceLocator.get('googleAnalytics');
    return new PopularPostsService(logger, googleAnalytics);
});

/**
 * Returns an instance of the post content controller
 */
serviceLocator.register('postContentController', (serviceLocator) => {
    let postContentService = serviceLocator.get('postContentService');
    let recommendationService = serviceLocator.get('recommendationService');
    let popularPostsService = serviceLocator.get('popularPostsService');
    return new PostContentController(postContentService, recommendationService, popularPostsService);
});

/**
 * Returns an instance of the carmudi api search helper library
 */
serviceLocator.register('carmudiApiSearch', (serviceLocator) => {
    let logger = serviceLocator.get('logger');
    return new CarmudiApiSearch(config.services.carmudi_api_search, logger);
});

/**
 * Returns an instance of the contentful helper library
 */
serviceLocator.register('contentful', () => {
    let logger = serviceLocator.get('logger');
    return new Contentful(config.services.contentful, logger);
});

/**
 * Returns an instance of the google analytics helper library
 */
serviceLocator.register('googleAnalytics', () => {
    let logger = serviceLocator.get('logger');
    return new GoogleAnalytics(config.services.ga, logger);
});

module.exports = serviceLocator;
