'use strict';

exports.handler = (event, context, callback) => {
    var postSlug      = event.pathParameters.postSlug,
        resourceType  = event.pathParameters.postType,
        body          = { 
          slug: postSlug, 
          type: resourceType,
          hello: 'world everyone'
        };
    callback(null, {
        "statusCode": '200',
        "headers": { 'Content-Type': 'application/json' },
        "body": JSON.stringify(body)
    });
};