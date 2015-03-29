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
	CONSTANTS
){
	function Map(options){
		var me = this;

		extend(me,{
			scope: {},

			cache: {},
			enableCache: true
		},options);
	}

	extend(Map.prototype,{
		self: Map,

		parse: function(id){
			return id.split('.');
		},

		set: function(id,value){
			var me = this,
				parts = me.parse(id),
				last = parts.pop(),
				root;

			root = forEach(parts,function(index,part){
				var loc = this.result,
					currId = parts.slice(0,index + 1).join('.');

                if (!loc[part]) {
                    loc[part] = {};
                }

                if (me.enableCache) {
					me.cache[currId] = loc[part];
				}

                this.result = loc[part];
			},me.scope);

			if (me.enableCache) {
				me.cache[id] = value;
			}

	        return root[last] = value;
		},

		create: function(){
			var me = this;

			return forEach(arguments,function(_,id){
				var parts = me.parse(id);

				this.result = forEach(parts,function(_,part){
					var loc = this.result,
						currId = parts.slice(0,index + 1).join('.');

                    if (!loc[part]) {
                        loc[part] = {};
                    }

                    if (me.enableCache) {
						me.cache[currId] = loc[part];
					}

                    this.result = loc[part];
				},me.scope);
			});
		},

		get: function(id){
			var me = this,
				parts;

			if (me.enableCache) {
				return me.cache[id];
			}

			parts = me.parse(id);

			return forEach(parts,function(_,part){
				var loc = this.result;

                if (!loc || !loc[part]) {
                    this.result = null;
                    this.skip =  true;
                } else {
                	this.result = loc[part];
                }
			},me.scope);
		}
	});

	return Map;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./Constants')
);