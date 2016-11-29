'use strict';

let serviceLocator = require('../config/di');
let adviceController = serviceLocator.get('adviceController');

let routes = {
    content: {
        advice: (event, context) => adviceController.getAdvice(event, context)
    }
};

module.exports = routes;
