'use strict';

let contentful = require('contentful');
let errors = require('./errors');

class Contentful {

    /**
     * Contentful library
     * @constructor
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.logger = logger;
        this.client = contentful.createClient({
            space: config.space_id,
            accessToken: config.keys.content_delivery
        });
    }

    /**
     * Query contentful api with slug
     * @param slug
     * @returns {Promise.<TResult>}
     */
    getEntryBySlug(slug) {
        return this.client.getEntries({ 'content_type': 'post', 'fields.slug': slug })
        .then((response) => {
            this.logger.info(`Successfully queried contentful for slug entry: ${slug}`);
            return response.items;
        }).catch((error) => {
            this.logger.error(`Failed to fetch data from contentful ${error.message}`);
            throw new errors.ApiError('An error occurred while trying to fetch data from contentful');
        });
    }
}

module.exports = Contentful;
