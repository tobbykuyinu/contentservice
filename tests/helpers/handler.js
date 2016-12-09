'use strict';

const context = {};
const index = require('../../src/index');

const handle = (event) => {
    return new Promise((resolve, reject) => {
        index.handler(event, context, (err, response) => {
            if (err) {
                return reject(new Error(`Failed to simulate call to lambda function: ${err.message}`));
            }

            return resolve(response);
        });
    });
};

module.exports = { handle };
