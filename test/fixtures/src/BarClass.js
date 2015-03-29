'use strict';

var Klass = require('../../../src/Core');

module.exports = Klass.define('Test.Fixtures.Src.BarClass',{
	mixins: {
		test: 'Test.Fixtures.Src.MixinsClass'
	},
	test: function(){
		return this.wat();
	}
});