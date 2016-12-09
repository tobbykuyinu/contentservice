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
     * getAdvice - handles the endpoint /content/advice/{postSlug}
     * @param event
     * @returns {Promise}
     */
    getAdvice(event) {
        const slug = event.pathParameters.postSlug;
        const country = event.queryStringParameters.country;
        const language = event.queryStringParameters.language;
        let advice;
        let products;

        return this.adviceService.getAdviceBySlug(slug)
        .then(response => {
            advice = response;
            return this.recommendationService.getProductsFromAdvice(response, country, language);
        })
        .then(response => {
            products = response;
            return { status: httpStatus.OK, body: { advice, products } };
        })
        .catch(err => {
            let code;

            switch (err.constructor) {
                case error.AdviceNotFound:
                    code = httpStatus.NOT_FOUND;
                    break;
                case error.ApiError:
                    code = httpStatus.FAILED_DEPENDENCY;
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
