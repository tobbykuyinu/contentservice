'use strict';

const errors = require('./errors');
const google = require('googleapis');
const analytics = google.analytics('v3');
const MAX_LIST_COUNT = 10;
const AUTH_SCOPE = ['https://www.googleapis.com/auth/analytics.readonly'];

class GoogleAnalytics {

    /**
     * Google Analytics Library
     * @constructor
     * @param config
     * @param logger
     */
    constructor(config, logger) {
        this.logger = logger;
        this.authClient = new google.auth.JWT(
            config.client_email,
            null,
            GoogleAnalytics.parseKey(config.private_key),
            AUTH_SCOPE,
            null
        );
        this.propertyIds = config.property_ids;
    }

    /**
     * Get top pages in google analytics for a given content type/category pattern
     * @param path
     * @param country
     * @returns {Promise}
     */
    getTopPagesByPath(path, country) {
        path = '/cars/toyota/camry/';
        const propertyId = this.getCountryPropertyId(country);
        const _this = this;

        return new Promise((resolve, reject) => {
            if (!propertyId) {
                this.logger.error(`No Google Analytics property ID found for country: ${country}`);
                reject(new errors.InvalidParams('No Analytics property found for country provided'));
            }

            this.authClient.authorize((err) => {
                if (err) {
                    this.logger.error(`An error occurred while authorizing the google auth client: ${err.message}`);
                    return reject(
                        new errors.ApiError('An error occurred while trying to fetch data from Google Analytics')
                    );
                }

                analytics.data.ga.get({
                    auth: this.authClient,
                    ids: propertyId,
                    dimensions: 'ga:pagePath,ga:pageTitle',
                    metrics: 'ga:pageViews',
                    'start-date': '30daysAgo',
                    'end-date': 'today',
                    filters: `ga:pagePath=@${path}`,
                    sort: '-ga:pageViews',
                    'max-results': MAX_LIST_COUNT
                }, (err, response) => {
                    if (err) {
                        this.logger.error(`Failed to fetch popular posts for ${path} in ${country}: ${err.message}`);
                        return reject(
                            new errors.ApiError('An error occurred while trying to fetch data from Google Analytics')
                        );
                    }

                    this.logger.info(`Successfully fetched popular posts for ${path} in ${country} from GA`);
                    resolve(_this.parseResponse(response));
                });
            });
        });
    }

    /**
     * Formats response data from google analytics
     * @param responseData
     * @returns {*}
     */
    parseResponse(responseData) {
        let headers = [];
        let response = [];
        const columnHeaders = responseData.columnHeaders || [];
        const responseRows = responseData.rows || [];

        columnHeaders.forEach(header => {
            let val = header.name.split('ga:');
            headers.push(val[1]);
        });

        responseRows.forEach(row => {
            let rowData = {};
            let i = 0;

            headers.forEach(header => {
                rowData[header] = row[i++];
            });

            response.push(rowData);
        });

        return response;
    }

    /**
     * Get the google analytics property id for the provided country
     * @param country
     * @returns {*}
     */
    getCountryPropertyId(country) {
        if (!country) {
            return null;
        }

        country = country.toLowerCase();
        return this.propertyIds[country];
    }

    /**
     * Parse private key as gotten from env
     * @param key
     */
    static parseKey(key) {
        key = key.substring(1, key.length - 1);
        key = key.split('\\n');
        key = key.join('\n');

        return key;
    }
}

module.exports = GoogleAnalytics;
