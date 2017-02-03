'use strict';

const joi = require('joi');

const responseObject = {
    title: joi.string().required(),
    price: joi.object().required().keys({
        conditions: joi.string().required(),
        value: joi.string().required(),
        currency_symbol: joi.string().required(),
        price_conditions: joi.string().required()
    }),
    images: joi.array().required().items(
        joi.object().required().keys({
            url: joi.string().required()
        })
    ),
    slug: joi.string().required(),
    sku: joi.string().required(),
    user: joi.object().required().keys({
        user_address: joi.object().required().keys({
            agency_address: joi.string().allow('').optional()
        })
    })
};

const apiResponse = {
    meta: joi.object().required().keys({
        total: joi.number().integer().required()
    }),
    items: joi.array().required().items(responseObject),
    aggregations: joi.array().optional()
};

module.exports = {
    apiResponseValidation: apiResponse,
    objectValidation: responseObject,
    arrayValidation: joi.array().required().items(responseObject)
};
