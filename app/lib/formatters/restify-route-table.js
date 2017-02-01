'use strict';

/**
 @description Prints out a table of Restify routes
 **/

module.exports =  function (routes) {
    const Table = require('cli-table');

    let table = new Table({
        style: {
            head: ['green'],
            compact: true
        },
        head: ['', 'Name', 'Path', 'Scope']
    });

    // lets used in loops below
    let row;
    let index;
    let path;
    let scope;
    let version;
    let val;

    console.log('\nAPIs for this service:');

    for (let key in routes) {
        if (routes.hasOwnProperty(key)) {
            val = routes[key];

            if (val.versions.length) {
                // loop through the versions of this endpoint
                for (index in val.versions) {
                    row = {};

                    version = val.versions[index];

                    // simplify the version number (if possible)
                    // and avoid replacing ".0" in 1.0.2
                    if (version.slice(-2) === '.0') {
                        version = version.replace(new RegExp('.0', 'g'), '');
                    }

                    path = '/v' + version + val.spec.path;
                    scope = (val.spec.hasOwnProperty('scope')) ? val.spec.scope : 'n/a';
                    row[val.method] = [val.name, path, scope];

                    table.push(row);
                }

            } else {
                row = {};

                path = val.spec.path;
                scope = (val.spec.hasOwnProperty('scope')) ? val.spec.scope : 'n/a';
                row[val.method] = [val.name, path, scope];

                table.push(row);
            }
        }
    }

    console.log(table.toString());

    return table;
};
