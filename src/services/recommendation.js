'use strict';

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
        const query = advice.suggestionsWidget;

        return this.client.getSuggestions(query, country, language)
        .then(response => {
            this.logger.info(`Successfully fetched product suggestions for advice`);

            if (response.items.length < 1) {
                this.logger.error(`Zero results found for search query: ${query}`);
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
