'use strict';

const joi = require('joi');
const FilterParser = require('../lib/filter_parser');
const adviceSchema = require('../validations/advice_post');

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
     * Get products from content suggestion widget data
     * @param advice
     * @returns {Promise.<T>}
     */
    getProductSuggestionsFromAdvice(advice) {
        const country = advice.country[0].toLowerCase();
        const language = advice.language[0].toLowerCase();
        const filterWidget = advice.suggestionsWidget[0];

        return this.getProductsByFilter(filterWidget, country, language);
    }

    /**
     * Get a uniformly formatted array of crosslinks from the mixed crosslink format from a content object
     * @param advice
     * @returns {Promise.<TResult>}
     */
    getCrossLinksFromAdvice(advice) {
        const country = advice.country[0].toLowerCase();
        const language = advice.language[0].toLowerCase();
        let crossLinks = advice.crossLinking;
        let promises = [];
        let response = [];

        crossLinks.forEach(crossLink => {
            const joiValidation = joi.validate(crossLink, adviceSchema.widgetObject);

            if (joiValidation.error) {
                response.push(crossLink);
            } else {
                const links = this.getProductsByFilter(crossLink, country, language)
                .then(products => {
                    if (products.length > 0) {
                        response.push({
                            widgetName: crossLink.widgetName,
                            linkItem: RecommendationService.parseProductLinks(products)
                        });
                    }
                });

                promises.push(links);
            }
        });

        return Promise.all(promises)
        .then(() => {
            return response;
        });
    }

    /**
     * Transforms a content widget into search filters and returns a response from search api using the filters
     * @param filter
     * @param country
     * @param language
     * @returns {Promise.<TResult>}
     */
    getProductsByFilter(filter, country, language) {
        const filterParser = new FilterParser(filter);
        filter = filterParser.generateFilter();

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

    /**
     * Transforms a list of product objects to a list of title and link objects
     * @param productData
     * @returns {*}
     */
    static parseProductLinks(productData) {
        return productData.map(product => {
            return {
                title: product.title,
                link: product.slug
            };
        });
    }
}

module.exports = RecommendationService;
