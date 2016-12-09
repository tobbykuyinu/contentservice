'use strict';

const errors = require('./errors');
const querystring = require('querystring');
const request = require('requestretry').defaults({ json: true, maxAttempts: 2 });

class CarmudiApiSearch {

    /**
     * Carmudi API Search client
     * @constructor
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.baseUrl = config.url;
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
        let filter = {
            page: 1,
            limit: 2,
            q: 'toyota',
            vertical: 'cars'
        };
        filter = querystring.stringify(filter);
        const endpoint = `${this.baseUrl}/search/${country}/${language}/listings?${filter}`;

        return request.post(endpoint)
        .then(response => {
            this.logger.info(`Successfully fetched suggestions from Carmudi Search API`);
            return response.body;
        })
        .catch(error => {
            this.logger.error(`Failed to query Carmudi Search API for recommendations ${error.message}`);
            throw new errors.ApiError('An error occurred while trying to communicate with the Carmudi Search API');
        });
    }
}

module.exports = CarmudiApiSearch;
