const https = require('https');
const {createResponseHandler} = require('./responseHandler');

function purgeCache({token, email, zone, files}, callback)
{
    if (!token || !token.length) { return callback(new Error('Missing required option: token')); }
    if (!email || !email.length) { return callback(new Error('Missing required option: email')); }
    if (!zone || !zone.length) { return callback(new Error('Missing required option: zone')); }

    const requestBody = JSON.stringify(files && files.length ? {
        files: files
    } : {
        purge_everything: true
    });

    const requestOptions = {
        hostname: 'api.cloudflare.com',
        port: 443,
        path: `/client/v4/zones/${zone}/purge_cache`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody),
            'X-Auth-Key': token,
            'X-Auth-Email': email
        }
    };

    // Send request
    https.request(requestOptions, createResponseHandler(callback))
        .on('error', callback)
        .end(requestBody);
}

module.exports = purgeCache;
