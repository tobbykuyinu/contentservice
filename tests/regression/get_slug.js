'use strict';

const handler = require('../helpers/handler');
const httpStatus = require('http-status');
const joi = require('joi');
const contentfulMock = require('../helpers/contentful_mock');
const defaultEvent = require('../../event.json');
const validHeader = 'application/json';
const adviceSchema = require('../../src/validations/advice_post');

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
