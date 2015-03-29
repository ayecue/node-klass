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
	bind,
	from,
	CONSTANTS,
	Argmap,
	Listener
){
	function ProcessorBatch(options){
		var me = this;

		extend(me,{
			scope: null,
			collection: null,
			argMap: new Argmap(),
			hooks: new Listener()
		},options);

		me.argMap.set('hooks',me.hooks);
	}

	extend(ProcessorBatch.prototype,{
		self: ProcessorBatch,

		process: function(){
			var me = this,
				done = bind(me.process,me),
				callback;

			while (callback = me.collection.shift()) {
				if (callback.apply(me.scope,me.argMap.inject([done],true)) === false) {
					return;
				}
			}

			me.hooks.fire('processed',me.scope,me.argMap.collect());
		}
	});

	return ProcessorBatch;
})(
	require('../common/extend'),
	require('../common/bind'),
	require('../common/from'),
	require('../Constants'),
	require('../Argmap'),
	require('../Listener')
);