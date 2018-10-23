const assertOptions = require('../common/assertOptions');
const collapsePrefix = require('../../src/collapsePrefix');

module.exports = ({testSync}) => {

    function collapsePrefixTest(name, options, expected)
    {
        const displayText = `collapsePrefix :: ${name}`;
        testSync(displayText, () => assertOptions(expected, collapsePrefix(options)));
    }

    collapsePrefixTest('First, do no harm',
        {
            token: 'TOKEN_A',
            email: 'EMAIL_A',
            zone: 'ZONE_A',
        },
        {
            token: 'TOKEN_A',
            email: 'EMAIL_A',
            zone: 'ZONE_A',
        }
    );

    collapsePrefixTest('Remove prefixes',
        {
            cloudflare_token: 'TOKEN_A',
            CloudFlare_email: 'EMAIL_A',
            zone: 'ZONE_A',
        },
        {
            token: 'TOKEN_A',
            email: 'EMAIL_A',
            zone: 'ZONE_A',
        }
    );

    collapsePrefixTest('Prefer prefixed',
        {
            token: 'TOKEN_B',
            cloudflare_token: 'TOKEN_A',
        },
        {
            token: 'TOKEN_A',
        }
    );

    collapsePrefixTest('Prefer prefixed regardless of order',
        {
            cloudflare_token: 'TOKEN_A',
            token: 'TOKEN_B',
        },
        {
            token: 'TOKEN_A',
        }
    );

    collapsePrefixTest('Prefer prefixed regardless of case',
        {
            Cloudflare_token: 'TOKEN_A',
            token: 'TOKEN_B',
        },
        {
            token: 'TOKEN_A',
        }
    );

    collapsePrefixTest('Prefer last declaration',
        {
            Cloudflare_token: 'TOKEN_C',
            cloudflare_token: 'TOKEN_A',
            token: 'TOKEN_B',
        },
        {
            token: 'TOKEN_A',
        }
    );
};
