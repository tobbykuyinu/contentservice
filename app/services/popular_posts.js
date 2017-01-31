'use strict';

const errors = require('../lib/errors');

class PopularPostsService {

    /**
     * Popular posts service constructor
     * @constructor
     * @param logger
     * @param reportsProvider
     */
    constructor(logger, reportsProvider) {
        this.logger = logger;
        this.reportsProvider = reportsProvider;
    }

    /**
     * Get popular posts of a content by category (e.g. 'advice/tires') or type (e.g. 'advice')
     * @param country
     * @param type
     * @param category
     */
    getPopularPosts(country, type, category) {
        let path = type;

        if (!country) {
            this.logger.error(`No country specified to fetch popular posts from for: ${type}/${category}`);
            return Promise.reject(
                new errors.InvalidParams('Please specify a country code')
            );
        }

        if (category) {
            path += `/${category}`;
        }

        return this.reportsProvider.getTopPagesByPath(path, country)
        .then(topPages => {
            this.logger.info(`Successfully fetched ${topPages.length} popular posts for ${path}`);

            if (topPages.length === 0) {
                this.logger.info(`No results found for top pages for ${path}`);
            }

            return topPages;
        })
        .catch(err => {
            this.logger.error(`Error getting popular posts for path ${path}. ${err.message}`);
            throw err;
        });
    }
}

module.exports = PopularPostsService;
