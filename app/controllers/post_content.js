'use strict';

const httpStatus = require('http-status');
const error = require('../lib/errors');

class PostContentController {

    /**
     * Post Content Controller constructor
     * @constructor
     * @param postContentService
     * @param recommendationService
     * @param popularPostService
     */
    constructor(postContentService, recommendationService, popularPostService) {
        this.contentService = postContentService;
        this.recommendationService = recommendationService;
        this.popularPostService = popularPostService;
    }

    /**
     * getPost - handles the endpoint /content/{postType}/{postCategory}/{postSlug}
     * @param req
     * @param res
     * @param next
     * @returns {Promise}
     */
    getPost(req, res, next) {
        const postType = req.params.postType;
        const category = req.params.postCategory;
        const slug = req.params.postSlug;
        const country = req.query.country;
        const language = req.query.language;

        let data;

        this.contentService.getPostBySlug(postType, slug, category, country, language)
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
            res.send(httpStatus.OK, data);
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

            res.send(code, err);
        });

        return next();
    }

    /**
     * getPopularPosts - handles the endpoint: /popular/{postType}/{postCategory}
     * @param req
     * @param res
     * @param next
     * @returns {Promise}
     */
    getPopularPosts(req, res, next) {
        const postType = req.params.postType;
        const postCategory = req.params.postCategory;
        const country = req.query.country;

        this.popularPostService.getPopularPosts(country, postType, postCategory)
        .then(popularPosts => {
            res.send(httpStatus.OK, popularPosts);
        })
        .catch(err => {
            let code;

            switch (err.constructor) {
                case error.InvalidParams:
                    code = httpStatus.BAD_REQUEST;
                    break;
                case error.ApiError:
                    code = httpStatus.INTERNAL_SERVER_ERROR;
                    break;
                default:
                    code = httpStatus.INTERNAL_SERVER_ERROR;
                    err = new error.InternalServerError('Internal Server Error');
            }

            res.send(code, err);
        });

        return next();
    }
}

module.exports = PostContentController;
