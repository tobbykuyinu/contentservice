'use strict';

const errors = require('../errors');
const httpStatus = require('http-status');
const InvalidParamError = errors.InvalidParams;

/**
 *
 * @param joi joi validation object
 * @param logger winston based logging object
 * @param validationOptions Options to use for validation. For validation options please refer to Joi API documentation.
 *        https://github.com/hapijs/joi/blob/v7.2.3/API.md#validatevalue-schema-options-callback
 *
 * @return {paramValidationMiddleware}
 */
module.exports = function (joi, logger, validationOptions) {

    return function paramValidationMiddleware(req, res, next) {

        let options = validationOptions;
        let validation = req.route.validation; //validation object in route

        if (!validation) {
            return next(); // skip validation if not set
        }

        let validProperties = ['body', 'query', 'params'];

        if (!options) {
            options = {};
        }

        if (!options.allowUnknown) {
            options.allowUnknown = true; // always allow validation to allow unknown fields by default.
        }

        for (let i in validation) {
            if (validProperties.indexOf(i) < 0) {
                logger.debug('Route contains unsupported validation key');
                throw new Error('An unsupported validation key was set in route');

            } else {
                if (req[i] === undefined) {
                    logger.debug('Empty request ' + i + ' was sent');

                    res.send(
                        httpStatus.BAD_REQUEST,
                        new InvalidParamError('Missing request ' + i)
                    );
                    return;
                }

                let result = joi.validate(req[i], validation[i], options);

                if (result.error) {
                    logger.debug('validation error - %s', result.error);

                    res.send(
                        httpStatus.BAD_REQUEST,
                        new InvalidParamError(
                            'Invalid request ' + i + ' - ' + result.error.details[0].message
                        )
                    );
                    return;

                } else {
                    logger.debug('successfully validated request parameters');
                }
            }
        }

        next();
    };
};
