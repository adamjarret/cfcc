const fs = require('fs');
const path = require('path');
const walkArgv = require('argv-walk');

function maybeLoadFile(opts, relTo = '') {
    if (opts.config) {
        const configPath = path.resolve(relTo, opts.config);
        if (!opts['if-present'] || fs.existsSync(configPath)) {
            Object.keys(opts).forEach((key) => {
                if (opts[key] === undefined) {
                    delete opts[key];
                }
            });
            return Object.assign(fromFile(configPath), opts);
        }
    }

    return opts;
}

function fromArgv(argv) {
    const options = {
        email: process.env.CF_EMAIL,
        token: process.env.CF_TOKEN,
        zone: process.env.CF_ZONE
    };

    walkArgv(argv, {
        boolean: ['version'],
        onArg: (arg) => {
            if (arg.key) {
                options[arg.key] = arg.value;
            } else {
                if (!options.files) {
                    options.files = [];
                }
                options.files.push(arg.item);
            }
        }
    });

    return maybeLoadFile(options);
}

function fromFile(filePath) {
    return maybeLoadFile(JSON.parse(fs.readFileSync(filePath)), path.dirname(filePath));
}

module.exports = { fromArgv, fromFile };
