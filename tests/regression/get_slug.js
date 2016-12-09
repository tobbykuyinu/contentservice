'use strict';

const handler = require('../helpers/handler');
const httpStatus = require('http-status');
const joi = require('joi');
const contentfulMock = require('../helpers/contentful_mock');
const defaultEvent = require('../../event.json');
const validHeader = 'application/json';

describe('GET /{type}/{slug}', () => {
    it('should return a valid response when a slug is requested', (done) => {
        contentfulMock.successAdviceResponse(defaultEvent);
        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: joi.object().keys({
                    products: joi.array(),
                    advice: joi.object().keys({
                        title: joi.string().required(),
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
                            joi.object().required().keys({
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
                            })
                        ),
                        suggestionsWidget: joi.array().required().items(
                            joi.object().required().keys({
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
                                year: joi.number().integer().optional().min(1900).max(2018),
                                yearTo: joi.number().integer().optional().min(1900).max(2018),
                                mileageFrom: joi.number().integer().optional(),
                                mileageTo: joi.number().integer().optional(),
                            })
                        ),
                        tags: joi.string().required(),
                        author: joi.object().optional().keys({
                            fullName: joi.string().required(),
                            description: joi.string().optional()
                        }),
                    })
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return correct error response when call to contentful fails', (done) => {
        contentfulMock.errorAdviceResponse(defaultEvent);
        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.FAILED_DEPENDENCY).required(),
                body: joi.object().keys({
                    message: joi.string().required(),
                    code: joi.string().required().valid('API_ERROR')
                })
            };

            joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return a 404 when no advice is found for slug', (done) => {
        contentfulMock.notFoundAdviceResponse(defaultEvent);
        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.NOT_FOUND).required(),
                body: joi.object().keys({
                    message: joi.string().required(),
                    code: joi.string().required().valid('ADVICE_NOT_FOUND')
                })
            };

            joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });
});