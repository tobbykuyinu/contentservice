/**
 @description Setup routes
 **/

'use strict';

/** Application Routes **/
module.exports.setup = function setup(server, serviceLocator) {
    const postContentController = serviceLocator.get('postContentController');

    server.get({
        path: '/content/:postType/:postCategory/:postSlug',
        name: 'get_post_by_slug',
        version: '1.0.0',
        validation: {
            params: require('./validations/get_post_by_slug')
        }
    }, (req, res, next) => postContentController.getPost(req, res, next));
};

module.exports = routes;
