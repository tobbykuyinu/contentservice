'use strict';

const nock = require('nock');
const GOOGLE_TOKEN_URL = 'https://accounts.google.com/o/oauth2';
const GOOGLE_API_URL = 'https://www.googleapis.com/analytics';
const responseMockData = require('./mock_data/google_analytics_mock_data.json');
const emptyResponseMockData = require('./mock_data/empty_google_analytics_mock_data.json');

const reqPath = () => {
    return /\/v3\/data\/ga/;
};

/**
 * Mocks google api token calls for success
 */
const tokenSuccessMock = () => {
    nock(GOOGLE_TOKEN_URL)
    .post(/\/o\/oauth2\/token/)
    .twice()
    .reply(200, {
        access_token: 'access-token',
        expires_in: Date.now() + 1000
    });
};

/**
 * Mocks the call to google api for success
 */
const successResponse = () => {
    tokenSuccessMock();

    nock(GOOGLE_API_URL)
    .get(reqPath())
    .reply(200, responseMockData);
};

/**
 * Mocks the call to google api for an empty data set response
 */
const emptyDataResponse = () => {
    tokenSuccessMock();

    nock(GOOGLE_API_URL)
    .get(reqPath())
    .reply(200, emptyResponseMockData);
};

/**
 * Mocks the call to google api for error
 */
const errorResponse = () => {
    tokenSuccessMock();

    nock(GOOGLE_API_URL)
    .get(reqPath())
    .replyWithError('Error from Google API');
};

module.exports = {
    successResponse,
    emptyDataResponse,
    errorResponse
};
