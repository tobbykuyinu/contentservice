'use strict';

const httpStatus = require('http-status');
const errors = require('../lib/errors');

module.exports = (responseData) => {
    let response = {
        headers: { 'Content-Type': 'application/json' }
    };

    if (responseData.status === undefined) {
        response.statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        response.body = {
            message: 'Internal Server Error',
            code: new errors.InternalServerError().code
        };
        return response;
    }

    if (responseData.error !== undefined) {
        response.statusCode = responseData.status;
        response.body = {
            message: responseData.error.message || 'Internal Server Error',
            code: responseData.error.code
        };
    } else {
        response.statusCode = responseData.status;
        response.body = responseData.body || {};
    }

    response.body = JSON.stringify(response.body);
    return response;
};
