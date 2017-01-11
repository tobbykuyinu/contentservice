'use strict';

const errors = require('./errors');
const request = require('requestretry').defaults({ json: true, maxAttempts: 2 });
const joi = require('joi');
const productSchema = require('../validations/product_recommendation');

class CarmudiApiSearch {

    /**
     * Carmudi API Search client
     * @constructor
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.baseUrl = config.tier1.url;
        this.logger = logger;
    }

    /**
     * Get suggestions from the carmudi search api
     * @param query
     * @param country
     * @param language
     * @returns {Promise.<T>}
     */
    getSuggestions(query, country, language) {
        const filter = this.parseFilter(query);
        const endpoint = `${this.baseUrl}/search/${country}/${language}/listings?view=thumb`;

        return request.post(endpoint, { body: filter })
        .then(response => {
            this.logger.info(`Successfully fetched suggestions from Carmudi Search API`);

            const joiValidation = joi.validate(response.body, productSchema.apiResponseValidation);

            if (joiValidation.error) {
                throw new Error(JSON.stringify(joiValidation.error.details));
            }

            return joiValidation.value;
        })
        .catch(error => {
            this.logger.error(`Failed to query Carmudi Search API for recommendations ${error.message}`);
            throw new errors.ApiError('An error occurred while trying to communicate with the Carmudi Search API');
        });
    }

    parseFilter() {
        return {
            page: { num: 1, limit: 10 },
            filters: { 'brand.code': 'toyota' }
        };
    }
}

module.exports = CarmudiApiSearch;
