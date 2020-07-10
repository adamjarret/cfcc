const path = require('path');
const assertOptions = require('../common/assertOptions');
const fixturePath = require('../common/fixturePath');
const files = require('../common/files');
const { fromFile } = require('../../src/purgeCacheOptions');

module.exports = ({ testSync }) => {
    function fromFileTest(name, filePath, expected) {
        const displayText = `purgeCacheOptions.fromFile(${path.basename(
            filePath
        )}) :: ${name}`;
        testSync(displayText, () => assertOptions(expected, fromFile(filePath)));
    }

    fromFileTest('Simplest config', fixturePath('config-a.json'), {
        token: 'TOKEN_A',
        email: 'EMAIL_A',
        zone: 'ZONE_A'
    });

    fromFileTest('Level 1 extend', fixturePath('config-b.json'), {
        token: 'TOKEN_A',
        email: 'EMAIL_A',
        zone: 'ZONE_A',
        files
    });

    fromFileTest('Level 2 extend', fixturePath('config-c.json'), {
        token: 'TOKEN_A',
        email: 'EMAIL_A',
        zone: 'ZONE_C',
        files
    });

    fromFileTest(
        'Extend file in another directory that depends on a relative path',
        fixturePath('config-d.json'),
        {
            token: 'TOKEN_X',
            email: 'EMAIL_D',
            zone: 'ZONE_Y'
        }
    );
};
