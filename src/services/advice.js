'use strict';

const errors = require('../lib/errors');
const CONTENT_TYPE = 'advice';

class AdviceService {

    /**
     * Advice service constructor
     * @constructor
     * @param logger
     * @param contentProvider
     */
    constructor(logger, contentProvider) {
        this.logger = logger;
        this.contentProvider = contentProvider;
    }

    /**
     * Get advice by slug - returns advice data for a given slug
     * @param slug
     * @param category
     * @param country
     * @param language
     */
    getAdviceBySlug(slug, category, country, language) {
        return this.contentProvider.getEntryBySlug(CONTENT_TYPE, slug, category, country, language)
        .then(data => {
            this.logger.info('Successfully fetched data for slug');

            if (data.length < 1) {
                this.logger.info(`Empty result gotten for ${slug}`);
                throw new errors.AdviceNotFound('No Advice found for slug provided');
            }

            return data[0];
        })
        .catch(error => {
            this.logger.error(`Error getting advice for slug ${error.message}`);
            throw error;
        });
    }
}

module.exports = AdviceService;
