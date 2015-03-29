/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	printf,
	CONSTANTS
){
	return function(tpl,prop,value){
		var name;

		if (typeof tpl !== 'string') {
			throw new Error(CONSTANTS.ERRORS.LOG_INVALID_TYPE);
		}

		if (!prop) {
			return tpl;
		}

		if (value) {
			name = prop;
			prop = {};
			prop[name] = value;
		}

		return printf(tpl,prop);
	};
})(
	require('./printf'),
	require('../Constants')
);