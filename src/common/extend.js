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
	toArray
){
	return function() {
		var args = toArray(arguments),
			last = args.length - 1,
			nil = true,
			src = args.shift() || {};

		if (typeof args[last] === 'boolean') { 
			nil = args.pop();
		}
		
		return forEach(args,function(index,item){
			if (typeof item === 'object') {
				this.result = forEach(item,function(prop,child){
					if (!!(nil || child != null) && item.hasOwnProperty(prop)) {
						this.result[prop] = child;
					}
				},this.result);
			}
		},src);
	};
})(
	require('./forEach'),
	require('./toArray')
);