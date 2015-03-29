'use strict';

var Klass = require('../../../src/Core');

var fooClass = Klass.define('Test.Fixtures.Src.FooClass',{
	requires: [
		'Test.Fixtures.Src.BarClass'
	],
	constructor: function(){
		var barClass = new Test.Fixtures.Src.BarClass();

		this.test = barClass.test();
	}
});

module.exports = fooClass;

