'use strict';

const handler = require('../helpers/handler');
const httpStatus = require('http-status');
const joi = require('joi');
const contentfulMock = require('../helpers/contentful_mock');
const searchAPIMock = require('../helpers/carmudi_search_api_mock');
const defaultEvent = require('../../event.json');
const validHeader = 'application/json';
const adviceSchema = require('../../src/validations/advice_post');
const productSchema = require('../../src/validations/product_recommendation');

describe('GET /{type}/{category}/{slug}', () => {
    it('should fail to fetch a slug for an invalid route/content type', (done) => {
        let event = Object.assign({}, defaultEvent);
        event.pathParameters = { postType: 'invalidPostType' };

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
        contentfulMock.successAdviceResponse(defaultEvent);
        searchAPIMock.successResponse();

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: joi.object().keys({
                    products: joi.array(),
                    advice: adviceSchema.objectValidation
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
        contentfulMock.successAdviceResponse(defaultEvent);
        searchAPIMock.errorResponse();

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: joi.object().keys({
                    products: joi.array().length(0),
                    advice: adviceSchema.objectValidation
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return a valid product response in the body when call to search API is successful', (done) => {
        contentfulMock.successAdviceResponse(defaultEvent);
        searchAPIMock.successResponse();

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: joi.object().keys({
                    products: productSchema.arrayValidation,
                    advice: adviceSchema.objectValidation
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return products even when the product filters have no results from search API', (done) => {
        contentfulMock.successAdviceResponse(defaultEvent);
        searchAPIMock.notFoundResponse();

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: joi.object().keys({
                    products: productSchema.arrayValidation.min(1),
                    advice: adviceSchema.objectValidation
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });

    it('should return an empty product array when the schema from search API is invalid', (done) => {
        contentfulMock.successAdviceResponse(defaultEvent);
        searchAPIMock.invalidSchemaResponse();

        handler.handle(defaultEvent)
        .then(response => {
            const schema = {
                headers: joi.object().keys({
                    'Content-Type': joi.string().valid(validHeader).required()
                }),
                statusCode: joi.number().valid(httpStatus.OK).required(),
                body: joi.object().keys({
                    products: productSchema.arrayValidation.length(0),
                    advice: adviceSchema.objectValidation
                })
            };

            return joi.assert(response, schema);
        })
        .then(done)
        .catch(done);
    });
});
