/**
 * @description Define errors available in project
 */

'use strict';

const create = require('custom-error-generator');

module.exports = {
    ContentNotFound: create('ContentNotFound', { code: 'CONTENT_NOT_FOUND' }),

    MethodNotImplemented: create('MethodNotImplemented', { code: 'METHOD_NOT_IMPLEMENTED' }),

    InternalServerError: create('InternalServerError', { code: 'INTERNAL_SERVER_ERROR' }),

    InvalidParams: create('InvalidParams', { code: 'INVALID_PARAMS' }),

    ApiError: create('ApiError', { code: 'API_ERROR' })
};
