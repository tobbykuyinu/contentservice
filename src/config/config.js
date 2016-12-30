'use strict';

const appName = 'contentservice';

const config = {
    appName: appName,
    services: {
        contentful: {
            keys: {
                content_delivery: process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY,
                content_preview: process.env.CONTENTFUL_CONTENT_PREVIEW_API_KEY
            },
            space_id: process.env.CONTENTFUL_SPACE_ID
        },
        carmudi_api_search: {
            tier1: {
                url: process.env.API_SEARCH_URL_TIER_1
            },
            tier2: {
                url: process.env.API_SEARCH_URL_TIER_2
            }
        },
        ga: {
            url: 'gaApiUrl',
            token: 'gaToken'
        }
    }
};

module.exports = config;
