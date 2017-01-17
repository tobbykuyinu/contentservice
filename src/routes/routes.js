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
        advice: (event, context) => postContentController.getPost(postTypes.advice, event),
        insurance: (event, context) => postContentController.getPost(postTypes.insurance, event),
        financing: (event, context) => postContentController.getPost(postTypes.financing, event)
    }
};

module.exports = routes;
