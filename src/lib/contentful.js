'use strict';

const contentful = require('contentful');
const errors = require('./errors');

class Contentful {

    /**
     * Contentful library
     * @constructor
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.logger = logger;
        this.client = contentful.createClient({
            space: config.space_id,
            accessToken: config.keys.content_delivery
        });
    }

    /**
     * Query contentful api with slug
     * @param type
     * @param slug
     * @returns {Promise.<TResult>}
     */
    getEntryBySlug(type, slug) {
        return this.client.getEntries({ content_type: type, 'fields.slug': slug, include: 2 })
        .then((response) => {
            this.logger.info(`Successfully queried contentful for slug entry: ${slug}`);
            return this.parseResponseData(response.items);
        }).catch((error) => {
            this.logger.error(`Failed to fetch data from contentful ${error.message}`);
            throw new errors.ApiError('An error occurred while trying to fetch data from contentful');
        });
    }

    /**
     * Parse response to remove metadata and sub-fields' metadata
     * @param responseData
     * @returns {*}
     */
    parseResponseData(responseData) {
        let objResponse = {};
        let arrResponse = [];

        if (Array.isArray(responseData)) {
            responseData.forEach(data => {
                arrResponse.push(this.parseResponseData(data));
            });

            return arrResponse;
        } else if (typeof responseData === 'object') {
            if (responseData.sys !== undefined && responseData.fields !== undefined) {
                responseData = responseData.fields;
            }

            for (let prop in responseData) {
                if (responseData.hasOwnProperty(prop)) {
                    objResponse[prop] = this.parseResponseData(responseData[prop]);
                }
            }

            return objResponse;
        }

        return responseData;
    }
}

module.exports = Contentful;
