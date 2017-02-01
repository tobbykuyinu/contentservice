'use strict';

/**
 * JSON formatter.
 * @public
 * @function formatJSend
 * @param    {Object} req  the request object
 * @param    {Object} res  the response object
 * @param    {Object} body response body
 * @param    {Function} cb callback
 * @returns  {String}
 */
function formatJSend(req, res, body, cb) {
    let packet = {};

    if (body instanceof Error) {

        // handle errors responses
        packet.message = body.message;

        // add the error code if it is available
        if (body.code !== undefined) {
            packet.code = body.code;
        }

    } else {
        // handle success responses
        packet = body;
    }

    const data = JSON.stringify(packet);
    res.header('Content-Length', Buffer.byteLength(data));

    return cb(null, data);
}

module.exports = formatJSend;
