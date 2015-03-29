/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	extend,
	typeOf,
	toArray,
	CONSTANTS
){
	function Callback(options){
		var me = this,
			callback;

		if (typeof options === 'function') {
			callback = options;
			options = {};
		}

		extend(me,{
			priority: CONSTANTS.PRIORITY.LOW,
			args: null,
			appendArgs: null,
			scope: null,
			callback: callback
		},options);
	}

	extend(Callback.prototype,{
		self: Callback,

		execute: function(scope,args){
			var me = this;

			if (me.args != null) {
		        if (me.appendArgs) {
		        	if (typeOf(args) !== 'array') {
			            args = toArray(args);
			        }

		        	args = me.args.concat(args);
		        } else {
		        	args = me.args;
		        }
		    }

			return this.callback.apply(me.scope || scope,args);
		}
	});

	return Callback;
})(
	require('./common/extend'),
	require('./common/typeOf'),
	require('./common/toArray'),
	require('./Constants')
);