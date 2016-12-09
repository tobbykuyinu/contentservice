'use strict';

const nock = require('nock');
const config = require('../../src/config/config');
const CONTENTFUL_URL = 'https://cdn.contentful.com';
const adviceMockData = require('./advice_mock_data.json');

const successAdviceResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=post&fields.slug=${event.pathParameters.postSlug}`)
    .reply(200, adviceMockData);
};

const errorAdviceResponse = (event) => {
    nock(CONTENTFUL_URL)
    .get(`/spaces/${config.services.contentful.space_id}` +
        `/entries?content_type=post&fields.slug=${event.pathParameters.postSlug}`)
    .replyWithError('Error on contentful');
};

module.exports = {
    successAdviceResponse,
    errorAdviceResponse
};
