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
        this.tier1 = config.tier1.url;
        this.tier2 = config.tier2.url;
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
        return this.getRequestUrl(country)
        .then(baseUrl => {
            const endpoint = `${baseUrl}/search/${country}/${language}/listings?view=thumb`;
            const requestBody = CarmudiApiSearch.getRequestBody(filter);

            return request.post(endpoint, { body: requestBody });
        })
        .then(response => {
            this.logger.info(`Successfully fetched suggestions from Carmudi Search API`);

            const joiValidation = joi.validate(response.body, productSchema.apiResponseValidation);

            if (joiValidation.error) {
                throw new Error(JSON.stringify(joiValidation.error.details));
            }

            return joiValidation.value;
        })
        .catch(error => {
            this.logger.error(`Failed to query Carmudi Search API for recommendations. ${error.message}`);
            throw new errors.ApiError('An error occurred while trying to communicate with the Carmudi Search API');
        });
    }

    /**
     * BaseURL mapping for the two tiers
     * @param country
     * @returns {*}
     */
    getRequestUrl(country) {
        const tier1 = ['vn', 'ph', 'id'];
        const tier2 = ['mm', 'mx', 'bd', 'pk', 'lk', 'sa', 'qa'];
        const urls = {
            tier1: this.tier1,
            tier2: this.tier2
        };
        let baseUrl;

        if (tier1.indexOf(country.toLowerCase()) >= 0) {
            this.logger.info(`Using tier 1 url for country: ${country}`);
            baseUrl = urls.tier1;
        } else if (tier2.indexOf(country.toLowerCase()) >= 0) {
            this.logger.info(`Using tier 2 url for country: ${country}`);
            baseUrl = urls.tier2;
        } else {
            return Promise.reject(new Error(`No applicable URL found for country provided: ${country}`));
        }

        return Promise.resolve(baseUrl);
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
