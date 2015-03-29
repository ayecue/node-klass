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
				trace = me.self.trace;

			if (trace) {
				trace.$next = method;
				method.$last = trace;
			}

			me.self.trace = method;
		},

		pop: function(){
			var me = this,
				trace = me.self.trace;

			if (trace.$last) {
				var last = trace;
				me.self.trace = trace.$last;
				last.$last = null;
				me.self.trace.$next = null;
			}
		},

		get: function(){
			return this.self.trace;
		}
	});

	return new KlassStacktrace();
})(
	require('../common/extend')
);