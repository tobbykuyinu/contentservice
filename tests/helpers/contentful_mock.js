'use strict';

const nock = require('nock');
const config = require('.././config/config');
const CONTENTFUL_URL = 'https://cdn.contentful.com';
const contentMockData = require('./mock_data/contentful_post_mock_data.json');
const emptyContentMockData = require('./mock_data/empty_contentful_post_mock_data.json');
const invalidSchemaContentMockData = require('./mock_data/invalid_contentful_post_mock_data.json');
const invalidCountryContentMockData = require('./mock_data/invalid_country_contentful_post_mock_data.json');
const reqPath = (event) => {
    return `/spaces/${config.services.contentful.space_id}` +
    `/entries?content_type=${event.pathParameters.endpoint}&` +
    `fields.slug=${event.pathParameters.postSlug}&` +
    `fields.category=${event.pathParameters.postCategory}&` +
    `fields.country=${event.queryStringParameters.country.toUpperCase()}&` +
    `fields.language=${event.queryStringParameters.language}&include=2`;
};

/**
 * Mocks the call to contentful post fetch for success
 * @param event
 */
const successResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(reqPath(event))
    .reply(200, contentMockData);
};

/**
 * Mocks the call to contentful post fetch for a slug not found
 * @param event
 */
const notFoundResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(reqPath(event))
    .reply(200, emptyContentMockData);
};

/**
 * Mocks the call to contentful post fetch for error
 * @param event
 */
const errorResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(reqPath(event))
    .replyWithError('Error on contentful');
};

/**
 * Mocks the call to contentful for an invalid schema
 * @param event
 */
const invalidSchemaResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(reqPath(event))
    .reply(200, invalidSchemaContentMockData);
};

/**
 * Mocks the call to contentful for an invalid country in response
 * @param event
 */
const invalidCountryResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(reqPath(event))
    .reply(200, invalidCountryContentMockData);
};

module.exports = {
    successResponse,
    errorResponse,
    notFoundResponse,
    invalidSchemaResponse,
    invalidCountryResponse
};
