/**
 * This test has been removed for now as we are (might) not be using this implementation for the feature
 *
 * This should be removed or updated (depending on the decided implementation) once an implementation is decided upon
 **/

// /*
// 'use strict';
//
// const handler = require('../helpers/handler');
// const httpStatus = require('http-status');
// const joi = require('joi');
// const googleAnalyticsMock = require('../helpers/google_analytics_mock');
// const validHeader = 'application/json';
// const baseEvent = require('../../event.json');
// let defaultEvent = Object.assign({}, baseEvent);
// defaultEvent.pathParameters = { resource: 'popular', endpoint: 'advice', postCategory: 'category' };
// defaultEvent.queryStringParameters = { country: 'id' };
//
// describe('GET /popular/{type}/{category}', () => {
//     it('Should fail to fetch popular posts when country is not provided', (done) => {
//         let event = Object.assign({}, defaultEvent);
//         event.queryStringParameters = { };
//
//         handler.handle(event)
//         .then(response => {
//             const schema = {
//                 headers: joi.object().keys({
//                     'Content-Type': joi.string().valid(validHeader).required()
//                 }),
//                 statusCode: joi.number().valid(httpStatus.BAD_REQUEST),
//                 body: joi.object().keys({
//                     message: joi.string().required(),
//                     code: joi.string().required().valid('INVALID_PARAMS')
//                 })
//             };
//
//             return joi.assert(response, schema);
//         })
//         .then(done)
//         .catch(done);
//     });
//
//     it('Should fail to fetch popular posts when an invalid country is provided', (done) => {
//         let event = Object.assign({}, defaultEvent);
//         event.queryStringParameters = { country: 'invalid' };
//
//         handler.handle(event)
//         .then(response => {
//             const schema = {
//                 headers: joi.object().keys({
//                     'Content-Type': joi.string().valid(validHeader).required()
//                 }),
//                 statusCode: joi.number().valid(httpStatus.BAD_REQUEST),
//                 body: joi.object().keys({
//                     message: joi.string().required(),
//                     code: joi.string().required().valid('INVALID_PARAMS')
//                 })
//             };
//
//             return joi.assert(response, schema);
//         })
//         .then(done)
//         .catch(done);
//     });
//
//     it('Should fail to fetch popular posts for an invalid route/content type', (done) => {
//         let event = Object.assign({}, defaultEvent);
//         event.pathParameters = { resource: 'popular', endpoint: 'invalidPostType' };
//
//         handler.handle(event)
//         .then(response => {
//             const schema = {
//                 headers: joi.object().keys({
//                     'Content-Type': joi.string().valid(validHeader).required()
//                 }),
//                 statusCode: joi.number().valid(httpStatus.NOT_IMPLEMENTED).required(),
//                 body: joi.object().keys({
//                     message: joi.string().required(),
//                     code: joi.string().required().valid('METHOD_NOT_IMPLEMENTED')
//                 })
//             };
//
//             return joi.assert(response, schema);
//         })
//         .then(done)
//         .catch(done);
//     });
//
//     it('Should return a valid popular posts success response for a valid request', (done) => {
//         googleAnalyticsMock.successResponse();
//
//         handler.handle(defaultEvent)
//         .then(response => {
//             const schema = {
//                 headers: joi.object().keys({
//                     'Content-Type': joi.string().valid(validHeader).required()
//                 }),
//                 statusCode: joi.number().valid(httpStatus.OK).required(),
//                 body: joi.array().required().min(10).items(
//                     joi.object().required().keys({
//                         pagePath: joi.string().required(),
//                         pageTitle: joi.string().required(),
//                         pageViews: joi.number().required()
//                     })
//                 )
//             };
//
//             return joi.assert(response, schema);
//         })
//         .then(done)
//         .catch(done);
//     });
//
//     it('Should return an empty list for a valid request with no popular posts found', (done) => {
//         googleAnalyticsMock.emptyDataResponse();
//
//         handler.handle(defaultEvent)
//         .then(response => {
//             const schema = {
//                 headers: joi.object().keys({
//                     'Content-Type': joi.string().valid(validHeader).required()
//                 }),
//                 statusCode: joi.number().valid(httpStatus.OK).required(),
//                 body: joi.array().required().length(0)
//             };
//
//             return joi.assert(response, schema);
//         })
//         .then(done)
//         .catch(done);
//     });
//
//     it('Should return a valid error response for an error with accessing Google API', (done) => {
//         googleAnalyticsMock.errorResponse();
//
//         handler.handle(defaultEvent)
//         .then(response => {
//             const schema = {
//                 headers: joi.object().keys({
//                     'Content-Type': joi.string().valid(validHeader).required()
//                 }),
//                 statusCode: joi.number().valid(httpStatus.INTERNAL_SERVER_ERROR).required(),
//                 body: joi.string().required()
//             };
//
//             return joi.assert(response, schema);
//         })
//         .then(done)
//         .catch(done);
//     });
// });
// */
