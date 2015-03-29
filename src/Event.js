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
	indexOf,
	CONSTANTS,
	Collection,
	Callback
){
	function Event(options){
		var me = this;

		extend(me,{
			name: null,
			callbackInstances: new Collection({
				constructor: Callback,
				searchProperty: 'callback',
				sortProperty: 'priority'
			})
		},options);
	}

	extend(Event.prototype,{
		self: Event,

		push: function(options){
			var me = this;

			me.callbackInstances.push(options);
			me.callbackInstances.sort('DESC');

			return me;
		},

		remove: function(fn){
			this.callbackInstances.remove(fn);
		},

		get: function(fn){
			return this.callbackInstances.get(fn);
		},

		executeAll: function(scope,args){
			this.callbackInstances.each(function(_,callbackInstance){
				callbackInstance.execute(scope,args);
			});
		},

		clone: function(){
			var me = this;

			return new me.self({
				callbackInstances: me.callbackInstances.clone()
			});
		}
	});

	return Event;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/indexOf'),
	require('./Constants'),
	require('./Collection'),
	require('./Callback')
);