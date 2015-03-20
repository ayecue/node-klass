'use strict';

var Klass = require('../../../src/klass');

module.exports = Klass.define('Test.Fixtures.Src.BarClass',{
	mixins: {
		test: 'Test.Fixtures.Src.MixinsClass'
	},
	test: function(){
		return this.wat();
	}
});