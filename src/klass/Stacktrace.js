/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	extend
){
	function KlassStacktrace(){
		extend(this,{
			trace: null
		});
	}

	extend(KlassStacktrace.prototype,{
		self: KlassStacktrace,
		push: function(method){
			var me = this,
				trace = me.trace;

			if (trace) {
				trace.$next = method;
				method.$last = trace;
			}

			me.trace = method;
		},

		pop: function(){
			var me = this,
				trace = me.trace;

			if (trace.$last) {
				var last = trace;
				me.trace = trace.$last;
				last.$last = null;
				me.trace.$next = null;
			}
		},

		get: function(){
			return this.trace;
		}
	});

	return new KlassStacktrace();
})(
	require('../common/extend')
);