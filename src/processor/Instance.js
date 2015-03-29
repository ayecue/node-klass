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
	forEach,
	toArray,
	emptyFn,
	typeOf,
	from,
	CONSTANTS
){
	function ProcessorInstance(options){
		var me = this;

		extend(me,{
			name: null,
			process: emptyFn,
			ignoreFilter: false,
			filter: null,
			priority: CONSTANTS.PRIORITY.LOW
		},options);

		me.initFilter();
	}

	extend(ProcessorInstance.prototype,{
		self: ProcessorInstance,
		
		initFilter: function(){
			var me = this;

			if (me.filter == null && me.name == null) {
				me.ignoreFilter = true;
				return;
			}

			if (me.filter == null) {
				me.filter = me.name;
			}

			if (typeOf(me.filter) !== 'array') {
				me.filter = from(me.filter);
			}
		},

		getCallbacks: function(values){
			var me = this;

			if (me.ignoreFilter) {
				return from(me.process);
			}

			return forEach(me.filter,function(_,prop){
				if (values.hasOwnProperty(prop)) {
					this.result.push(me.process);
				}
			},[]);
		}

	});

	return ProcessorInstance;
})(
	require('../common/extend'),
	require('../common/forEach'),
	require('../common/toArray'),
	require('../common/emptyFn'),
	require('../common/typeOf'),
	require('../common/from'),
	require('../Constants')
);