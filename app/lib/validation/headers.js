'use strict';

const errors = require('../errors');
const httpStatus = require('http-status');
const InvalidContentTypeError = errors.InvalidParams;

module.exports = function(logger) {

    return function headerValidationMiddleware(req, res, next) {

        let headerValidation = req.route.accept; //accept property in route

        if (!headerValidation) {
            return next(); // skip validation if not set
        }

        if (req.headers['content-type'] === req.route.accept) {
            logger.debug('request content-type correct - ', req.headers['content-type']);

            return next();
        } else {

            logger.error('request content-type incorrect - ', req.headers['content-type']);

            res.send(
                httpStatus.BAD_REQUEST,
                new InvalidContentTypeError(
                    'Invalid content-type - expecting ' + req.route.accept
                )
            );
        }
    };
};
