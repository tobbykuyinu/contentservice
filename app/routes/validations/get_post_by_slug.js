'use strict';

let joi = require('joi');

module.exports = {
    params: {
        postType: joi.string().valid('advice', 'financing', 'insurance').required(),
        postCategory: joi.string().required(),
        postSlug: joi.string().required()
    },
    query: {
        country: joi.string().required(),
        language: joi.string()
    }
};
