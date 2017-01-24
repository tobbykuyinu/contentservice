'use strict';

const serviceLocator = require('../config/di');
const postContentController = serviceLocator.get('postContentController');
const postTypes = {
    advice: 'advice',
    insurance: 'insurance',
    financing: 'financing'
};

let routes = {
    content: {
        advice: (event) => postContentController.getPost(postTypes.advice, event),
        insurance: (event) => postContentController.getPost(postTypes.insurance, event),
        financing: (event) => postContentController.getPost(postTypes.financing, event)
    },
    popular: {
        advice: (event) => postContentController.getPopularPosts(postTypes.advice, event),
        insurance: (event) => postContentController.getPopularPosts(postTypes.insurance, event),
        financing: (event) => postContentController.getPopularPosts(postTypes.financing, event)
    }
};

module.exports = routes;
