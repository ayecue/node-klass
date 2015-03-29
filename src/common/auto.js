/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	forEach,
	message,
	CONSTANTS
){
	function auto(scope,keyword,value){
		var setterName, getterName;

		if (typeof keyword === 'object') {
			return forEach(keyword,function(keyword,value){
				auto(scope,keyword,value);
			});
		}

		if (typeof value === 'function') {
			return;
		}

		setterName = message(CONSTANTS.KLASS.SETTER,'keyword',keyword),
		getterName = message(CONSTANTS.KLASS.GETTER,'keyword',keyword);

		if (!(setterName in scope)) {
			scope[setterName] = function(v){
				this[keyword]=v;
				return this;
			};
		}

		if (!(getterName in scope)) {
			scope[getterName] = function(){
				return this[keyword];
			};
		}
	}

	return auto;
})(
	require('./forEach'),
	require('./message'),
	require('../Constants')
);