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
	Collection,
	CONSTANTS,
	ManagerReference
){
	function ManagerReferences(options){
		var me = this;

		extend(me,{
			refs: new ManagerReference(),

			cache: new Collection({
				searchProperty: 'id',
				getProperty: 'ref'
			}),
			enableCache: true
		},options);
	}

	extend(ManagerReferences.prototype,{
		self: ManagerReferences,

		parse: function(id){
			return id.split('.');
		},

		set: function(id){
			var me = this,
				parts = me.parse(id),
				ref;

			ref = forEach(parts,function(index,part){
				var ref = this.result,
					currId = parts.slice(0,index + 1).join('.');

				ref = ref.push(currId);

				if (me.enableCache) {
					me.cache.push({
						id: currId,
						ref: ref
					});
				}

                this.result = ref;
			},me.refs);

			return ref;
		},

		get: function(id){
			var me = this,
				parts;

			if (me.enableCache) {
				return me.cache.get(id);
			}

			parts = me.parse(id);

			return forEach(parts,function(index,part){
				var ref = this.result,
					currtId = parts.slice(0,index + 1).join('.'),
					child = ref.get(currtId);

				if (child) {
               		this.result = child;
               	} else {
               		this.result = null;
               		this.skip = true;
               	}
			},me.refs);
		}
	});

	return ManagerReferences;
})(
	require('../common/extend'),
	require('../common/forEach'),
	require('../Collection'),
	require('../Constants'),
	require('./Reference')
);