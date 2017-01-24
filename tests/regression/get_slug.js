'use strict';

const handler = require('../helpers/handler');
const httpStatus = require('http-status');
const joi = require('joi');
const contentfulMock = require('../helpers/contentful_mock');
const searchAPIMock = require('../helpers/carmudi_search_api_mock');
const defaultEvent = require('../../event.json');
const validHeader = 'application/json';
const postContentSchema = require('../../src/validations/post_content');
const productSchema = require('../../src/validations/product_recommendation');

describe('GET /content/{type}/{category}/{slug}', () => {
    it('should fail to fetch a slug for an invalid route/content type', (done) => {
        let event = Object.assign({}, defaultEvent);
        event.pathParameters = { resource: 'content', endpoint: 'invalidPostType' };

        handler.handle(event)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.NOT_IMPLEMENTED).required(),
                body: joi.object().keys({
                    message: joi.string().required(),
                    code: joi.string().required().valid('METHOD_NOT_IMPLEMENTED')
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return a valid response when a slug is requested', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.successResponse();

        handler.handle(defaultEvent)
        .then(response => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = joi.array();

            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: responseValidation
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return correct error response when call to contentful fails', (done) => {
        contentfulMock.errorResponse(defaultEvent);

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.INTERNAL_SERVER_ERROR).required(),
                body: joi.object().keys({
                    message: joi.string().required(),
                    code: joi.string().required().valid('API_ERROR')
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return a 404 when no post is found for slug', (done) => {
        contentfulMock.notFoundResponse(defaultEvent);

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.NOT_FOUND).required(),
                body: joi.object().keys({
                    message: joi.string().required(),
                    code: joi.string().required().valid('CONTENT_NOT_FOUND')
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return an error when the schema from contentful is invalid', (done) => {
        contentfulMock.invalidSchemaResponse(defaultEvent);

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.INTERNAL_SERVER_ERROR).required(),
                body: joi.object().keys({
                    message: joi.string().required(),
                    code: joi.string().required().valid('API_ERROR')
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return a valid response with an empty product array when Search API call fails', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.errorResponse();

        handler.handle(defaultEvent)
        .then(response => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = joi.array().length(0);

            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: responseValidation
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return a valid product response in the body when call to search API is successful', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.successResponse();

        handler.handle(defaultEvent)
        .then(response => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation;

            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: responseValidation
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return products even when the product filters have no results from search API', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.notFoundResponse();

        handler.handle(defaultEvent)
        .then(response => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation.min(1);

            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: responseValidation
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return an empty product array when the schema from search API is invalid', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.invalidSchemaResponse();

        handler.handle(defaultEvent)
        .then(response => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation.length(0);

            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: responseValidation
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should fail to fetch products if an invalid country is provided from contentful', (done) => {
        contentfulMock.invalidCountryResponse(defaultEvent);
        searchAPIMock.successResponse();

        handler.handle(defaultEvent)
        .then(response => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation.length(0);

            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: responseValidation
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });
});
