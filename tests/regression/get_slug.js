'use strict';

const server = require('../../server');
const request = require('supertest')(server);
const httpStatus = require('http-status');
const joi = require('joi');
const contentfulMock = require('../helpers/contentful_mock');
const searchAPIMock = require('../helpers/carmudi_search_api_mock');
const postContentSchema = require('../../app/validations/post_content');
const productSchema = require('../../app/validations/product_recommendation');
const VALID_PATH = '/v1/content/advice/Tires/this-is-a-test?country=id';
const defaultEvent = { postCategory: 'Tires', postSlug: 'this-is-a-test', country: 'id', language: 'en' };

describe('GET /content/{type}/{category}/{slug}', () => {
    it('should fail to fetch a slug for an invalid route/content type', (done) => {
        request.get('/v1/content/advice/this-is-a-test')
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.NOT_IMPLEMENTED)
        .expect(res => {
            const schema = {
                message: joi.string().required(),
                code: joi.string().required().valid('METHOD_NOT_IMPLEMENTED')
            };

            joi.assert(res, schema);
        })
        .end(done);
    });

    it('should return a valid response when a slug is requested', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.successResponse();

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.OK)
        .expect(res => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = joi.array();

            joi.assert(res, responseValidation);
        })
        .end(done);
    });

    it('should return correct error response when call to contentful fails', (done) => {
        contentfulMock.errorResponse(defaultEvent);

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .expect(res => {
            const schema = {
                message: joi.string().required(),
                code: joi.string().required().valid('API_ERROR')
            };

            joi.assert(res, schema);
        })
        .end(done);
    });

    it('should return a 404 when no post is found for slug', (done) => {
        contentfulMock.notFoundResponse(defaultEvent);

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.NOT_FOUND)
        .expect(res => {
            const schema = {
                message: joi.string().required(),
                code: joi.string().required().valid('CONTENT_NOT_FOUND')
            };

            joi.assert(res, schema);
        })
        .end(done);
    });

    it('should return an error when the schema from contentful is invalid', (done) => {
        contentfulMock.invalidSchemaResponse(defaultEvent);

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .expect(res => {
            const schema = {
                message: joi.string().required(),
                code: joi.string().required().valid('API_ERROR')
            };

            joi.assert(res, schema);
        })
        .end(done);
    });

    it('should return a valid response with an empty product array when Search API call fails', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.errorResponse();

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.OK)
        .expect(res => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = joi.array().length(0);

            joi.assert(res, responseValidation);
        })
        .end(done);
    });

    it('should return a valid product response in the body when call to search API is successful', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.successResponse();

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.OK)
        .expect(res => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation;

            joi.assert(res, responseValidation);
        })
        .end(done);
    });

    it('should return products even when the product filters have no results from search API', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.notFoundResponse();

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.OK)
        .expect(res => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation.min(1);

            joi.assert(res, responseValidation);
        })
        .end(done);
    });

    it('should return an empty product array when the schema from search API is invalid', (done) => {
        contentfulMock.successResponse(defaultEvent);
        searchAPIMock.invalidSchemaResponse();

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.OK)
        .expect(res => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation.length(0);

            joi.assert(res, responseValidation);
        })
        .end(done);
    });

    it('should fail to fetch products if an invalid country is provided from contentful', (done) => {
        contentfulMock.invalidCountryResponse(defaultEvent);
        searchAPIMock.successResponse();

        request.get(VALID_PATH)
        .send()
        .expect('Content-type', /json/)
        .expect(httpStatus.OK)
        .expect(res => {
            let responseValidation = postContentSchema.objectValidation;
            responseValidation.suggestionsWidget = productSchema.arrayValidation.length(0);

            joi.assert(res, responseValidation);
        })
        .end(done);
    });
});
