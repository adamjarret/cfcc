const assertOptions = require('../common/assertOptions');
const fixturePath = require('../common/fixturePath');
const files = require('../common/files');
const { fromArgv } = require('../../src/purgeCacheOptions');

module.exports = ({ testSync }) => {
    function fromArgvTest(name, argv, expected) {
        const displayText = `purgeCacheOptions.fromArgv :: ${name}`;
        testSync(displayText, () => assertOptions(expected, fromArgv(argv)));
    }

    fromArgvTest(
        'Simplest options',
        ['--token', 'TOKEN_A', '--email', 'EMAIL_A', '--zone', 'ZONE_A'],
        {
            token: 'TOKEN_A',
            email: 'EMAIL_A',
            zone: 'ZONE_A'
        }
    );

    fromArgvTest('Load options from file', ['--config', fixturePath('config-a.json')], {
        token: 'TOKEN_A',
        email: 'EMAIL_A',
        zone: 'ZONE_A'
    });

    fromArgvTest(
        'Load options from file (--if-present)',
        ['--config', fixturePath('does-not-exist.json'), '--if-present'],
        {
            token: undefined,
            email: undefined,
            zone: undefined
        }
    );

    fromArgvTest(
        'Load options from file and add',
        ['--config', fixturePath('config-a.json'), ...files],
        {
            token: 'TOKEN_A',
            email: 'EMAIL_A',
            zone: 'ZONE_A',
            files
        }
    );

    fromArgvTest(
        'Load options from file and override',
        ['--config', fixturePath('config-a.json'), '--zone', 'NO_FLY'],
        {
            token: 'TOKEN_A',
            email: 'EMAIL_A',
            zone: 'NO_FLY'
        }
    );

    fromArgvTest(
        'Load options from file that includes another file and override',
        ['--config', fixturePath('config-d.json'), '--zone', 'NO_FLY'],
        {
            token: 'TOKEN_X',
            email: 'EMAIL_D',
            zone: 'NO_FLY'
        }
    );
};
