const fs = require('fs');
const path = require('path');
const parseArgs = require('minimist');

const maybeLoadFile = (opts, relTo = '') => !opts.config || !opts.config.length ? opts : (
    Object.assign(fromFile(path.resolve(relTo, opts.config)), opts)
);

function fromArgv(argv)
{
    const options = parseArgs(argv);
    const {_: files} = options;

    delete options._;

    if (files && files.length) {
        options.files = files;
    }

    return maybeLoadFile(options);
}

function fromFile(filePath)
{
    return maybeLoadFile(JSON.parse(fs.readFileSync(filePath)), path.dirname(filePath));
}

module.exports = {fromArgv, fromFile};
