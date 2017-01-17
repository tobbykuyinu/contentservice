'use strict';

const httpStatus = require('http-status');
const error = require('../lib/errors');

class PostContentController {

    /**
     * Post Content Controller constructor
     * @constructor
     * @param postContentService
     * @param recommendationService
     */
    constructor(postContentService, recommendationService) {
        this.contentService = postContentService;
        this.recommendationService = recommendationService;
    }

    /**
     * getPost - handles the endpoint /content/{postType}/{postCategory}/{postSlug}
     * @param postType
     * @param event
     * @returns {Promise}
     */
    getPost(postType, event) {
        const slug = event.pathParameters.postSlug;
        const category = event.pathParameters.postCategory;
        const country = event.queryStringParameters.country;
        const language = event.queryStringParameters.language;

        let data;

        return this.contentService.getPostBySlug(postType, slug, category, country, language)
        .then(response => {
            data = response;

            return Promise.all([
                this.recommendationService.getProductSuggestionsFromPostContent(data)
                .then(suggestions => { data.suggestionsWidget = suggestions; }),

                this.recommendationService.getCrossLinksFromPostContent(data)
                .then(crossLinks => { data.crossLinking = crossLinks; })
            ]);
        })
        .then(() => {
            return { status: httpStatus.OK, body: data };
        })
        .catch(err => {
            let code;

            switch (err.constructor) {
                case error.ContentNotFound:
                    code = httpStatus.NOT_FOUND;
                    break;
                case error.ApiError:
                    code = httpStatus.INTERNAL_SERVER_ERROR;
                    break;
                default:
                    code = httpStatus.INTERNAL_SERVER_ERROR;
                    err = new error.InternalServerError('Internal Server Error');
            }

            return { status: code, error: err };
        });
    }
}

module.exports = PostContentController;
