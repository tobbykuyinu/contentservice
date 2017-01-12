'use strict';

const contentful = require('contentful');
const errors = require('./errors');
const joi = require('joi');
const adviceSchema = require('../validations/advice_post');

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
     * @param category
     * @param country
     * @param language
     * @returns {Promise.<TResult>}
     */
    getEntryBySlug(type, slug, category, country, language) {
        const filter = {
            content_type: type,
            'fields.slug': slug,
            'fields.category': category,
            'fields.country': (country) ? country.toUpperCase() : '',
            'fields.language': (language) ? language.toLowerCase() : '',
            include: 2
        };

        return this.client.getEntries(filter)
        .then((response) => {
            this.logger.info(`Successfully queried contentful for slug entry: ${slug}`);
            const responseData = this.parseResponseData(response.items);

            //append content creation and update dates.
            // These values are in the stripped off meta object so we add from here
            if (responseData[0]) {
                responseData[0].createdAt = response.items[0] ? response.items[0].sys.createdAt : null;
                responseData[0].updatedAt = response.items[0] ? response.items[0].sys.createdAt : null;
            }

            const joiValidation = joi.validate(responseData, adviceSchema.arrayValidation);

            if (joiValidation.error) {
                throw new Error(JSON.stringify(joiValidation.error.details));
            }

            return joiValidation.value;
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
