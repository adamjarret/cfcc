function createResponseHandler(callback) {
    return (response) => {
        const data = [];
        response.on('data', (chunk) => data.push(chunk));
        response.on('end', () => handleEnd(data.join(''), response.statusCode, callback));
    };
}

function handleEnd(responseBody, statusCode, callback) {
    // Handle CloudFlare API response body
    //  Thanks https://api.cloudflare.com/#getting-started-responses
    try {
        // Parse responseBody
        const responseResult = JSON.parse(responseBody);

        // callback with error if API did not report success
        if (!responseResult.success) {
            const e = new Error('API error(s)');
            e.statusCode = statusCode;
            e.responseResult = responseResult;
            return callback(e);
        }

        // callback with result
        callback(null, responseResult);
    } catch (error) {
        // callback with error if responseBody could not be parsed as JSON
        const e = new Error('Unexpected response');
        e.statusCode = statusCode;
        e.responseBody = responseBody;
        e.parseError = error;
        callback(e);
    }
}

module.exports = { createResponseHandler, handleEnd };
