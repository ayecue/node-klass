/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	message
){
	return function(){
		var str = message.apply(null,arguments);
		return new Error(str);
	};
})(
	require('./message')
);