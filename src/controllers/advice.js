'use strict';

const httpStatus = require('http-status');
const error = require('../lib/errors');

class AdviceController {

    /**
     * Advice Controller constructor
     * @constructor
     * @param adviceService
     * @param recommendationService
     */
    constructor(adviceService, recommendationService) {
        this.adviceService = adviceService;
        this.recommendationService = recommendationService;
    }

    /**
     * getAdvice - handles the endpoint /content/advice/{postCategory}/{postSlug}
     * @param event
     * @returns {Promise}
     */
    getAdvice(event) {
        const slug = event.pathParameters.postSlug;
        const category = event.pathParameters.postCategory;
        const country = event.queryStringParameters.country;
        const language = event.queryStringParameters.language;
        let advice;
        let products;

        return this.adviceService.getAdviceBySlug(slug, category, country, language)
        .then(response => {
            advice = response;

            return Promise.all([
                this.recommendationService.getProductSuggestionsFromAdvice(advice)
                .then(suggestions => { products = suggestions; }),

                this.recommendationService.getCrossLinksFromAdvice(advice)
                .then(crossLinks => { advice.crossLinking = crossLinks; })
            ]);
        })
        .then(() => {
            return { status: httpStatus.OK, body: { advice, products } };
        })
        .catch(err => {
            let code;

            switch (err.constructor) {
                case error.AdviceNotFound:
                    code = httpStatus.NOT_FOUND;
                    break;
                case error.ApiError:
                    code = httpStatus.INTERNAL_SERVER_ERROR;
                    break;
                default:
                    code = httpStatus.INTERNAL_SERVER_ERROR;
                    err = new error.InternalServerError('Internal Server Error');
            }

            return { status: code, error: err };
        });
    }
}

module.exports = AdviceController;
