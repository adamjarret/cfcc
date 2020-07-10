function collapsePrefix(options, pattern = /^cloudflare_/i) {
    // Handle prefixed keys
    //  Keys in the JSON config file may optionally be prefixed with "cloudflare_" for flexibility.
    //  The keys are sorted so if both email and cloudflare_email are present, cloudflare_email wins.
    return Object.keys(options)
        .sort(compareStringDescending)
        .reduce((o, k) => {
            o[k.replace(pattern, '')] = options[k];
            return o;
        }, {});
}

function compareStringDescending(a, b) {
    const aL = a.toLowerCase();
    const bL = b.toLowerCase();
    if (aL === bL) {
        return 0;
    }
    return a > b ? -1 : 1;
}

module.exports = collapsePrefix;
