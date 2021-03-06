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
	toArray,
	typeOf
){
	function applyIf() {
		var args = toArray(arguments),
			src = args.shift() || {};
		
		return forEach(args,function(index,item){
			if (typeof item === 'object') {
				this.result = forEach(item,function(prop,child){
					var scope = this.result;

					if (typeOf(child) === 'object' && typeOf(scope[prop]) === 'object') {
						scope[prop] = applyIf(scope[prop],child);
					} else if (!this.result[prop] || child) {
						this.result[prop] = child;
					}
				},this.result);
			}
		},src);
	};

	return applyIf;
})(
	require('./forEach'),
	require('./toArray'),
	require('./typeOf')
);