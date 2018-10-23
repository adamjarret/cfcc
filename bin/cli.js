#!/usr/bin/env node
/* eslint-disable no-console */

const {collapsePrefix, purgeCache, purgeCacheOptions: {fromArgv}} = require('..');
const {version} = require('../package.json');

const options = collapsePrefix(fromArgv(process.argv.slice(2)));

if(options.version) {
    console.log(version);
    process.exit(0);
}

purgeCache(options, (error, responseResult) => {

    if (error) {
        handleError(error);
    }

    console.log(JSON.stringify(responseResult, null, 2));

    process.exit(0);
});

function handleError(error)
{
    console.error(error.message || error);

    const {responseBody, responseResult} = error;

    if (responseBody) {
        console.error(responseBody);
    }

    if (responseResult) {
        console.error(JSON.stringify(responseResult, null, 2));
    }

    usage();

    process.exit(1);
}

function usage()
{
    console.log(`
Usage: cfcc [options] [URL...]

--token     account auth token
--email     account auth email
--zone      zone id
--config    load options from JSON file
--version   show cfcc version and exit

If no URLs are specified all files are purged.
`);
}
