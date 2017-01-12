'use strict';

const nock = require('nock');
const config = require('../../src/config/config');
const CONTENTFUL_URL = 'https://cdn.contentful.com';
const adviceMockData = require('./mock_data/advice_mock_data.json');
const emptyAdviceMockData = require('./mock_data/empty_advice_mock_data.json');
const invalidSchemaAdviceMockData = require('./mock_data/invalid_advice_mock_data.json');
const invalidCountryAdviceMockData = require('./mock_data/invalid_country_advice_mock_data.json');

/**
 * Mocks the call to contentful advice fetch for success
 * @param event
 */
const successAdviceResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=${event.pathParameters.postType}&` +
        `fields.slug=${event.pathParameters.postSlug}&` +
        `fields.category=${event.pathParameters.postCategory}&include=2`)
    .reply(200, adviceMockData);
};

/**
 * Mocks the call to contentful advice fetch for a slug not found
 * @param event
 */
const notFoundAdviceResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=${event.pathParameters.postType}&` +
        `fields.slug=${event.pathParameters.postSlug}&` +
        `fields.category=${event.pathParameters.postCategory}&include=2`)
    .reply(200, emptyAdviceMockData);
};

/**
 * Mocks the call to contentful advice fetch for error
 * @param event
 */
const errorAdviceResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=${event.pathParameters.postType}&` +
        `fields.slug=${event.pathParameters.postSlug}&` +
        `fields.category=${event.pathParameters.postCategory}&include=2`)
    .replyWithError('Error on contentful');
};

/**
 * Mocks the call to contentful for an invalid schema
 * @param event
 */
const invalidSchemaResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=${event.pathParameters.postType}&` +
        `fields.slug=${event.pathParameters.postSlug}&` +
        `fields.category=${event.pathParameters.postCategory}&include=2`)
    .reply(200, invalidSchemaAdviceMockData);
};

/**
 * Mocks the call to contentful for an invalid country in response
 * @param event
 */
const invalidCountryAdviceResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=${event.pathParameters.postType}&` +
        `fields.slug=${event.pathParameters.postSlug}&` +
        `fields.category=${event.pathParameters.postCategory}&include=2`)
    .reply(200, invalidCountryAdviceMockData);
};

module.exports = {
    successAdviceResponse,
    errorAdviceResponse,
    notFoundAdviceResponse,
    invalidSchemaResponse,
    invalidCountryAdviceResponse
};
