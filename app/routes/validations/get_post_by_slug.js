'use strict';

let joi = require('joi');

module.exports = {
    postType: joi.string().valid('advice', 'financing', 'insurance').required(),
    postCategory: joi.string().required(),
    postSlug: joi.string().required()
};
