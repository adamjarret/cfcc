const path = require('path');

function fixturePath() {
    return path.resolve(path.join(__dirname, '..', 'fixtures', ...arguments));
}

module.exports = fixturePath;
