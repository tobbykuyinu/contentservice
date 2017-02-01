'use strict';

let winston = require('winston');
let fs = require('fs');

/**
 * Function reponsible for formatting the log lines in way that is parsable by a logstash implementation (for example).
 * @param entry the log entry to format
 * @returns {string} the log line that will be passed to the transports
 */
let formatter = function (entry) {
    let date = new Date(entry.timestamp()).toISOString();

    let message = '';
    if ((entry.message !== undefined)) {
        message = entry.message;
    }

    let context = '';
    if (entry.meta && Object.keys(entry.meta).length) {
        context = JSON.stringify(entry.meta);
    }

    return date + ' ' + entry.level.toUpperCase() + ' ' + message + ' ' + context;
};

/**
 * Generates the timestamp used by the log entries.
 * @returns {number} the timestamp
 */
let generateTimestamp = function () {
    return Date.now();
};

/**
 * Creates transports based on config values
 * @returns {Array} the created transports
 */
let createTransports = function (config) {

    let transports = [];

    // setup the file transport
    if (config.file) {

        // create the file
        fs.open(config.file, 'w', function (err, fd) {
            if (err) {
                return;
            }

            fs.chmod(config.file, '755');
            fs.close(fd);

            // setup the log transport
            transports.push(
                new winston.transports.File({
                    filename: config.file,
                    json: false,
                    timestamp: generateTimestamp,
                    formatter: formatter,
                    level: config.level
                })
            );
        });
    }

    // setup the console transport, because devs don't always want to tail the log file.
    // if config.console is set to true, a console logger will be included.
    if (config.console) {
        transports.push(
            new winston.transports.Console({
                timestamp: generateTimestamp,
                formatter: formatter,
                level: config.level
            })
        );
    }

    return transports;
};

module.exports = {

    /**
     * Creates a new logger instance using the config provided.
     * @param  {object} config The config used to setup the logger transports.
     * @return {logger} Returns a new instance of the winston logger.
     */
    create: function (config) {
        if (!config) {
            return console;
        }

        return new winston.Logger({
            transports: createTransports(config)
        });
    }
};
