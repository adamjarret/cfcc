# cfcc

[![Package Version](https://badgen.net/npm/v/cfcc)](https://npmjs.com/package/cfcc)
[![Install Size](https://badgen.net/packagephobia/install/cfcc)](https://packagephobia.now.sh/result?p=cfcc)

A lightweight and hyper-focused node.js library and CLI utility for purging some (or all) files from a CloudFlare zone cache.

## Install

To use the `cfcc` command, install the module globally:

    npm install -g cfcc

To use the exposed API, install the module as a project dependency:

    npm install --save cfcc

Compatible with node 6 and later.

## CLI

    Usage: cfcc [options] [URL...]

    --email         account auth email
    --token         account auth token
    --zone          zone id
    --config        load options from JSON file
    --if-present    suppress error if config file is not found
    --version       show cfcc version and exit

    If no URLs are specified all files are purged.

Some options may also be specified as environment variables:

-   `CF_EMAIL`,
-   `CF_TOKEN`,
-   `CF_ZONE`

Environment variables take precedence over values loaded from a config file.

Command line arguments take precedence over environment variables and values loaded from a config file.

A `config` property may be defined in a config file to extend the specified file and provide overrides.
See the [`purgeCacheOptions.fromFile` example](#example-1) below.

Option keys can optionally be prefixed with `cloudflare_` which can be useful
when loading a config file that is shared with other utilities.
Prefixed keys are preferred when present (ex. if both `cloudflare_token` and `token` keys are present,
the value from `cloudflare_token` is used).

### Examples

    # Provide options as command line arguments (purge all)
    cfcc --token AUTH_TOKEN --email AUTH_EMAIL --zone ZONE_ID

    # Provide options as command line arguments (purge specified URLs)
    cfcc --token AUTH_TOKEN --email AUTH_EMAIL --zone ZONE_ID "http://www.example.com/css/styles.css" "http://www.example.com/cat_picture.jpg"

    # Load options from config file
    cfcc --config path/to/config.json

    # Load options and override zone with argument
    cfcc --config path/to/config.json --zone ZONE_ID

## API

### `purgeCache(options, callback)`

Send an HTTPS request to the `purge_cache` endpoint of the CloudFlare API.

See [Purge All Files][purge_all] and [Purge Files by URL][purge_by_url] in CloudFlare API Documentation for request details.

#### Arguments

`options` is an object with the following keys:

-   `token` &mdash; (_string_) account auth token [_required_]
-   `email` &mdash; (_string_) account auth email [_required_]
-   `zone` &mdash; (_string_) zone id [_required_]
-   `files` &mdash; (_array of strings_) URLs to purge [_optional_]
    -   If `files` is not provided or is an empty array, all files are purged.

`callback` is a function with the signature `(error, responseResult)`

-   `responseResult` is an object parsed from the API response (or `undefined` if an error occurred).
    See [Responses](https://api.cloudflare.com/#getting-started-responses)
    in CloudFlare API Documentation for more information.
-   `error` is an `Error` object or `null`.
    -   If the error occurred when parsing the response body, the error will have a
        `responseBody` property that contains the string that failed to be parsed.
    -   If the error was indicated by a falsy `success` value in the response,
        the error will have a `responseResult` property that contains the object parsed from the API response.

#### Example

    const {purgeCache} = require('cfcc');

    const options = {
        token: 'AUTH_TOKEN',
        email: 'AUTH_EMAIL',
        zone: 'ZONE_ID',
        files: [
            // If files is undefined or an empty array, all files are purged
            'http://www.example.com/css/styles.css',
            'http://www.example.com/js/bundle.js'
        ]
    };

    purgeCache(options, (error, responseResult) => {
        // responseResult is an object (parsed from JSON response)
    });

### `purgeCacheOptions.fromFile(filePath)`

Load options from a JSON file.
JSON files may specify a file path as the `config` property to recursively load related configurations.

#### Arguments

`filePath` is a string containing a file path.

#### Example

**credentials.json**

    {
        "email": ACCOUNT_EMAIL,
        "token": ACCOUNT_TOKEN
    }

**config.json**

    {
        "config": "credentials.json",
        "zone": ZONE_ID
    }

**purge.js**

    const {purgeCache, purgeCacheOptions: {fromFile}} = require('cfcc');

    const options = fromFile('./config.json');

    purgeCache(options, (error, responseResult) => {
        // responseResult is an object (parsed from JSON response)
    });

### `purgeCacheOptions.fromArgv(argv)`

Load options from an argv array. Used by CLI to parse arguments.

#### Arguments

`argv` is an array of strings.

#### Example

    const {purgeCache, purgeCacheOptions: {fromArgv}} = require('cfcc');

    const options = fromArgv(process.argv.slice(2));

    purgeCache(options, (error, responseResult) => {
        // responseResult is an object (parsed from JSON response)
    });

## Development

Clone the repository and run `npm install` in the project root.

**Optional:** Run `npm install -g cspell nyc` to install optional development dependencies
(used for spell-check and unit test coverage reporting).

### Run Tests

    npm test

## Contributing

Fork the repo and submit a pull request.
Contributions must adhere to the code style enforced by prettier.

## Versioning

[SemVer][semver] is used for versioning.
For the versions available, see the [tags on this repository][tags].

## Author

[Adam Jarret](https://atj.me)

## License

This project is licensed under the _MIT License_.
See the [LICENSE.txt][license] file for details.

[semver]: https://semver.org/
[tags]: https://github.com/adamjarret/cfcc/tags
[license]: https://github.com/adamjarret/cfcc/blob/master/LICENSE.txt
[purge_all]: https://api.cloudflare.com/#zone-purge-all-files
[purge_by_url]: https://api.cloudflare.com/#zone-purge-files-by-url
