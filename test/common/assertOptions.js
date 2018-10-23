const {strictEqual, deepEqual} = require('assert');
const {acEx} = require('spooning');

function assertOptions(expected, actual)
{
    strictEqual(actual.token, expected.token, acEx(actual.token, expected.token, 'Bad token'));
    strictEqual(actual.email, expected.email, acEx(actual.email, expected.email, 'Bad email'));
    strictEqual(actual.zone, expected.zone, acEx(actual.zone, expected.zone, 'Bad zone'));
    deepEqual(actual.files, expected.files, acEx(actual.files, expected.files, 'Bad files'));
}

module.exports = assertOptions;
