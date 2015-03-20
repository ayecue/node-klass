'use strict';

var Klass = require('../src/klass');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.klass = {
    setUp: function(done) {
        // setup here if necessary
        done();
    },
    basic: function(test) {
        var actual,expected;

        expected = 'wat';

        Klass.setConfig({
            source: __filename
        }).require([
            'Test.Fixtures.Src.FooClass'
        ],function(){
            var momo = new Test.Fixtures.Src.FooClass();

            actual = momo.test;

            test.equal(actual, expected, 'task output should equal ' + expected);
        });

        test.done();
    }
};
