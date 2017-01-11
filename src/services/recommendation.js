'use strict';

const FilterParser = require('../lib/filter_parser');

class RecommendationService {

    /**
     * Recommendation Service
     * @constructor
     * @param logger
     * @param client
     */
    constructor(logger, client) {
        this.logger = logger;
        this.client = client;
    }

    /**
     * Get products from advice data
     * @param advice
     * @returns {Promise.<T>}
     */
    getProductsFromAdvice(advice) {
        const country = advice.country[0].toLowerCase();
        const language = advice.language[0].toLowerCase();
        const filterParser = new FilterParser(advice.suggestionsWidget[0]);
        const filter = filterParser.generateFilter();

        return this.client.getSuggestions(filter, country, language)
        .then(response => {
            this.logger.info(`Successfully fetched product suggestions for advice`);

            if (response.meta.total === 0) {
                this.logger.info(`Query produced zero results. 
                Non-matching result set for query: ${JSON.stringify(filter)}`);
            }

            if (response.items.length < 1) {
                this.logger.error(`Zero results found for search query: ${JSON.stringify(filter)}`);
            }

            return response.items;
        })
        .catch(error => {
            //failure to get products should not fail the entire request so we log and proceed
            this.logger.error(`Failed to fetch product suggestions for advice ${error.message}`);
            return [];
        });
    }
}

module.exports = RecommendationService;
