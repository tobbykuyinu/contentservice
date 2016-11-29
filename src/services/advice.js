'use strict';

let errors = require('../lib/errors');

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
     */
    getAdviceBySlug(slug) {
        return this.contentProvider.getEntryBySlug(slug)
        .then(data => {
            if (data.length < 1) {
                this.logger.info(`Empty result gotten for ${slug}`);
                throw new errors.AdviceNotFound('No Advice found for slug provided');
            }

            return data[0].fields;
        })
        .catch(error => {
            this.logger.error(`Error getting advice for slug ${error.message}`);
            throw error;
        });
    }
}

module.exports = AdviceService;
