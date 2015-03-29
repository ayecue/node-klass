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
	List,
	Collection,
	CONSTANTS
){
	function Processor(options){
		var me = this;

		extend(me,{
			types: [],
			listInstances: new Collection({
				constructor: List,
				searchProperty: 'type'
			})
		},options);

		me.initTypes();
	}

	extend(Processor.prototype,{
		self: Processor,
		
		initTypes: function(){
			var me = this;

			me.addType.apply(me,me.types);
			me.types = null;
			delete me.types;
		},

		addType: function(){
			var me = this;

			forEach(arguments,function(_,type){
				me.listInstances.push({
					type: type
				});
			});

			return me;
		},

		get: function(type){
			return this.listInstances.get(type);
		},

		collect: function(type,values){
			var me = this,
				listInstance = me.get(type);

			return listInstance.collect(values);
		},

		batch: function(type,scope,values,argMap){
			var me = this,
				listInstance = me.get(type);

			return listInstance.batch(scope,values,argMap);
		},

		register: function(type,options){
			var me = this,
				listInstance = me.get(type);

			listInstance.register(options);

			return me;
		},

		registerAll: function(){
			var me = this;

			forEach(arguments,function(_,options){
				me.register(options.type,options.config);
			});

			return me;
		}
	});

	return Processor;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/indexOf'),
	require('./processor/List'),
	require('./Collection'),
	require('./Constants')
);