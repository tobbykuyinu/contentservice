'use strict';

let httpStatus = require('http-status');
let error = require('../lib/errors');

class AdviceController {

    /**
     * Advice Controller constructor
     * @constructor
     * @param adviceService
     */
    constructor(adviceService) {
        this.adviceService = adviceService;
    }

    /**
     * getAdvice - handles the endpoint /content/advice/{postSlug}
     * @param event
     * @param context
     * @returns {Promise}
     */
    getAdvice(event, context) {
        let slug = event.pathParameters.postSlug;

        return this.adviceService.getAdviceBySlug(slug)
        .then(response => {
            return { status: httpStatus.OK, body: response };
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
