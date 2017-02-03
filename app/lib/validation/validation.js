'use strict';

let paramValidation   = require('./parameters');
let headersValidation = require('./headers');

module.exports = {

    /**
     * @constructor
     *
     * @class validationMiddleware
     *
     * @param joi An instance of joi validator object
     * @param logger An instance of the logging object
     *
     * @return {Function} function matching Restify middleware interface
     */
    paramValidation: paramValidation,

    /**
     * @constructor
     *
     * @class headerValidationMiddleware
     *
     * @param logger An instance of the logging object
     *
     * @return {Function} function matching Restify middleware interface
     */
    headerValidation: headersValidation
};
