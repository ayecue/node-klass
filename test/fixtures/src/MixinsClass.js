'use strict';

var Klass = require('../../../src/klass');

var fooClass = Klass.define('Test.Fixtures.Src.MixinsClass',{
	wat: function(){
		return 'wat';
	}
});

module.exports = fooClass;

