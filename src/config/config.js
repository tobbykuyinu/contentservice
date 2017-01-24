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
            client_email: process.env.GOOGLE_API_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_API_PRIVATE_KEY,
            property_ids: {
                vn: process.env.VN_ANALYTICS_ID,
                ph: process.env.PH_ANALYTICS_ID,
                id: process.env.ID_ANALYTICS_ID,
                mm: process.env.MM_ANALYTICS_ID,
                mx: process.env.MX_ANALYTICS_ID,
                bd: process.env.BD_ANALYTICS_ID,
                pk: process.env.PK_ANALYTICS_ID,
                lk: process.env.LK_ANALYTICS_ID,
                sa: process.env.SA_ANALYTICS_ID,
                qa: process.env.QA_ANALYTICS_ID,
            }
        }
    }
};

module.exports = config;
