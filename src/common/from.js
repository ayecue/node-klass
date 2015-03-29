/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	typeOf
){
	return function(values){
		if (typeOf(values) === "array") {
			return values;
		}
		return [values];
	};
})(
	require('./typeOf')
);