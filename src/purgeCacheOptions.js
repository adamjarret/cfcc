const fs = require('fs');
const path = require('path');
const walkArgv = require('argv-walk');

const maybeLoadFile = (opts, relTo = '') => !opts.config || !opts.config.length ? opts : (
    Object.assign(fromFile(path.resolve(relTo, opts.config)), opts)
);

function fromArgv(argv)
{
    const options = {};

    walkArgv(argv, {
        boolean: ['version'],
        onArg: (arg) => {
            if (arg.key) {
                options[arg.key] = arg.value;
            } else {
                if(!options.files) {
                    options.files = [];
                }
                options.files.push(arg.item);
            }
        }
    });

    return maybeLoadFile(options);
}

function fromFile(filePath)
{
    return maybeLoadFile(JSON.parse(fs.readFileSync(filePath)), path.dirname(filePath));
}

module.exports = {fromArgv, fromFile};
