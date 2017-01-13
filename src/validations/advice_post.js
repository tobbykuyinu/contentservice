'use strict';

const joi = require('joi');

const widgetObject = {
    widgetName: joi.string().required(),
    transmission: joi.array().optional().items(
        joi.string().required()
    ),
    sellerType: joi.array().optional().items(
        joi.string().required()
    ),
    category: joi.array().optional().items(
        joi.string().required()
    ),
    condition: joi.array().optional().items(
        joi.string().required()
    ),
    fuel: joi.array().optional().items(
        joi.string().required()
    ),
    model: joi.array().optional().items(
        joi.string().required()
    ),
    brand: joi.array().optional().items(
        joi.string().required()
    ),
    priceFrom: joi.number().integer().optional(),
    priceTo: joi.number().integer().optional(),
    yearFrom: joi.number().integer().optional().min(1900).max(2018),
    yearTo: joi.number().integer().optional().min(1900).max(2018),
    mileageFrom: joi.number().integer().optional(),
    mileageTo: joi.number().integer().optional(),
};

const responseObject = {
    title: joi.string().required(),
    createdAt: joi.string().required(),
    updatedAt: joi.string().required(),
    metadescription: joi.string().required(),
    hrefLang: joi.array().required(),
    canonicalTag: joi.string().required(),
    postImage: joi.object().required().keys({
        title: joi.string().required(),
        description: joi.string().optional(),
        file: joi.object().keys({
            url: joi.string().required(),
            details: joi.object().keys({
                size: joi.number().required(),
                image: joi.object().required().keys({
                    width: joi.number().required(),
                    height: joi.number().required()
                })
            }),
            fileName: joi.string().required(),
            contentType: joi.string().required()
        })
    }),
    category: joi.array().required().items(
        joi.string().required()
    ),
    content: joi.string().required(),
    slug: joi.string().required(),
    crossLinking: joi.array().required().items(
        joi.object().optional().keys(widgetObject),
        joi.object().optional().keys({
            widgetName: joi.string().required(),
            linkItem: joi.array().required().min(10).items(
                joi.object().required().keys({
                    title: joi.string().required(),
                    link: joi.string().required()
                })
            )
        })
    ),
    suggestionsWidget: joi.array().required().min(1).items(
        joi.object().required().keys(widgetObject)
    ),
    tags: joi.string().required(),
    author: joi.object().optional().keys({
        fullName: joi.string().required(),
        description: joi.string().optional()
    }),
    language: joi.array().required().max(1).items(
        joi.string().required()
    ),
    country: joi.array().required().max(1).items(
        joi.string().required()
    ),
    robotsMetatags: joi.array().required().max(1).items(
        joi.string().required()
    ),
};

module.exports = {
    widgetObject: widgetObject,
    objectValidation: responseObject,
    arrayValidation: joi.array().required().items(responseObject)
};
