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
	indexOf,
	CONSTANTS,
	Collection,
	Event
){
	function Listener(options){
		var me = this;

		extend(me,{
			eventInstances: new Collection({
				constructor: Event,
				searchProperty: 'name'
			})
		},options);
	}

	extend(Listener.prototype,{
		self: Listener,

		get: function(name){
			var me = this,
				idx = me.eventInstances.indexOf(name),
				newInstance;

			if (idx === -1) {
				idx = me.eventInstances.push({
					name: name
				});
			}

			return me.eventInstances.getById(idx);
		},

		on: function(name,callback){
			this.get(name).push(callback);
			return this;
		},

		off: function(name,callback){
			this.get(name).remove(callback);
			return this;
		},

		fire: function(name,scope,args){
			this.get(name).executeAll(scope,args);
			return this;
		},

		remove: function(name){
			return this.eventInstances.remove(name);
		}
	});

	return Listener;
})(
	require('./common/extend'),
	require('./common/indexOf'),
	require('./Constants'),
	require('./Collection'),
	require('./Event')
);