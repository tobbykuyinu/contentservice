'use strict';

const errors = require('../lib/errors');

class PostContentService {

    /**
     * Post content service constructor
     * @constructor
     * @param logger
     * @param contentProvider
     */
    constructor(logger, contentProvider) {
        this.logger = logger;
        this.contentProvider = contentProvider;
    }

    /**
     * Get post by slug - returns post data for a given slug
     * @param postType
     * @param slug
     * @param category
     * @param country
     * @param language
     */
    getPostBySlug(postType, slug, category, country, language) {
        return this.contentProvider.getEntryBySlug(postType, slug, category, country, language)
        .then(data => {
            this.logger.info('Successfully fetched data for slug');

            if (data.length < 1) {
                this.logger.info(`Empty result gotten for ${slug}`);
                throw new errors.ContentNotFound('No post found for slug provided');
            }

            return data[0];
        })
        .catch(error => {
            this.logger.error(`Error getting post for slug ${error.message}`);
            throw error;
        });
    }
}

module.exports = PostContentService;
