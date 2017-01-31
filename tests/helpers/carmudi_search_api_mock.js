'use strict';

const nock = require('nock');
const config = require('.././config/config');
const SEARCH_API_URL = config.services.carmudi_api_search.tier1.url;
const searchApiMockData = require('./mock_data/search_api_mock_data.json');
const emptySearchApiMockData = require('./mock_data/empty_search_api_mock_data.json');
const invalidSchemaSearchApiMockData = require('./mock_data/invalid_search_api_mock_data.json');

/**
 * Mocks the call to search API for success
 */
const successResponse = () => {
    nock(SEARCH_API_URL)
    .post(/\/1\/search/)
    .twice()
    .reply(200, searchApiMockData);
};

/**
 * Mocks the call to search API for a data not found
 */
const notFoundResponse = () => {
    nock(SEARCH_API_URL)
    .post(/\/1\/search/)
    .twice()
    .reply(200, emptySearchApiMockData);
};

/**
 * Mocks the call to search API fetch for error
 */
const errorResponse = () => {
    nock(SEARCH_API_URL)
    .post(/\/1\/search/)
    .twice()
    .replyWithError('Error on Search API');
};

/**
 * Mocks the call to search API fetch for an invalid schema
 */
const invalidSchemaResponse = () => {
    nock(SEARCH_API_URL)
    .post(/\/1\/search/)
    .twice()
    .reply(200, invalidSchemaSearchApiMockData);
};

module.exports = {
    successResponse,
    errorResponse,
    notFoundResponse,
    invalidSchemaResponse
};
