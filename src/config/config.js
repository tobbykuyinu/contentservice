'use strict';

let appName = 'contentservice';

let config = {
    appName: appName,
    services: {
        contentful: {
            keys: {
                content_delivery: process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY,
                content_preview: process.env.CONTENTFUL_CONTENT_PREVIEW_API_KEY
            },
            space_id: process.env.CONTENTFUL_SPACE_ID
        },
        ga: {
            url: 'gaApiUrl',
            token: 'gaToken'
        }
    }
};

module.exports = config;
