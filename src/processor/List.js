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
	Argmap,
	Collection,
	CONSTANTS,
	Instance,
	Batch
){
	function ProcessorList(options){
		var me = this;

		extend(me,{
			type: null,
			instances: new Collection({
				constructor: Instance,
				searchProperty: 'name',
				sortProperty: 'priority'
			})
		},options);
	}

	extend(ProcessorList.prototype,{
		self: ProcessorList,

		register: function(options){
			var me = this;

			me.instances.push(options);
			me.instances.sort('DESC');

			return me;
		},

		get: function(name){
			return this.instances.get(name);
		},

		collect: function(values,callback){
			var me = this;

			return me.instances.each(function(_,instance){
				var result;

				if (callback) {
					result = callback(instance,values);
				} else {
					result = instance.getCallbacks(values);
				}

				this.result.push.apply(this.result,result);
			},[]);
		},

		batch: function(scope,values,argMap){
			var me = this,
				newBatch = new Batch({
					scope: scope,
					collection: me.collect(values),
					argMap: new Argmap({
						map: argMap
					})
				});

			newBatch.argMap.set('values',values);

			return newBatch;
		}
	});

	return ProcessorList;
})(
	require('../common/extend'),
	require('../common/forEach'),
	require('../common/indexOf'),
	require('../Argmap'),
	require('../Collection'),
	require('../Constants'),
	require('./Instance'),
	require('./Batch')
);