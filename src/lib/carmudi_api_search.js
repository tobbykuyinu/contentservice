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
     * @param filter
     * @param country
     * @param language
     * @returns {Promise.<T>}
     */
    getSuggestions(filter, country, language) {
        const endpoint = `${this.baseUrl}/search/${country}/${language}/listings?view=thumb`;
        const requestBody = CarmudiApiSearch.getRequestBody(filter);

        return request.post(endpoint, { body: requestBody })
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

    /**
     * static generation of request body for the search API
     * @param filter
     * @returns {{page: {num: number, limit: number}, filters: *}}
     */
    static getRequestBody(filter) {
        return {
            page: { num: 1, limit: 10 },
            filters: filter
        };
    }
}

module.exports = CarmudiApiSearch;
