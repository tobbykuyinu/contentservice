'use strict';

const serviceLocator = require('../config/di');
const adviceController = serviceLocator.get('adviceController');

let routes = {
    content: {
        advice: (event, context) => adviceController.getAdvice(event, context)
    }
};

module.exports = routes;
