/**
 * @description Sets up the restify handlers.
 */

'use strict';

let errors = require('../lib/errors');
let httpStatusCodes = require('http-status');

/**
 * Allows us to register the restify server handlers.
 *
 * @param  {server} server An instance of the restify server
 */
module.exports.setup = function setup(server) {

    server.on('NotFound', (req, res) => {
        res.send(
            httpStatusCodes.NOT_IMPLEMENTED,
            new errors.MethodNotImplemented('Method not Implemented')
        );
    });

    server.on('VersionNotAllowed', (req, res) => {
        res.send(
            httpStatusCodes.NOT_FOUND,
            new errors.InvalidVersion('Unsupported API version requested')
        );
    });

    server.on('InvalidVersion', (req, res) => {
        res.send(
            httpStatusCodes.NOT_FOUND,
            new errors.InvalidVersion('Unsupported API version requested')
        );
    });

    server.on('uncaughtException', (req, res) => {
        res.send(
            httpStatusCodes.INTERNAL_SERVER_ERROR,
            new errors.InternalServerError('Method not Implemented')
        );
    });

    server.on('MethodNotAllowed', (req, res) => {
        res.send(
            httpStatusCodes.METHOD_NOT_ALLOWED,
            new errors.MethodNotImplemented('Method not Implemented')
        );
    });

};
