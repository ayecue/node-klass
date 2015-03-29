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
	toArray
){
	function Argmap(options){
		var me = this;

		extend(me,{
			map: {},
			includeArgs: []
		},options);
	}

	extend(Argmap.prototype,{
		self: Argmap,

		setIncludeArgs: function(){
			this.includeArgs = toArray(arguments);
			return this;
		},

		set: function(key,value){
			this.map[key] = value;
			return this;
		},

		get: function(key){
			return this.map[key];
		},

		remove: function(key){
			this.map[key] = null;
			delete this.map[key];
		},

		collect: function(args,appendArgs){
			var me = this,
				currArgs;

			if (args && appendArgs) {
				currArgs = me.includeArgs.concat(args);
			} else {
				currArgs = args || me.includeArgs;
			}


			currArgs = forEach(currArgs,function(_,key){
				var arg = me.map[key];

				this.result.push(arg);
			},[]);

			currArgs.push(me);

			return currArgs;
		},

		inject: function(params,appendParams){
			var me = this,
				currParams = [];

			if (!params) {
				params = [];
			}

			if (appendParams) {
				currParams = forEach(me.includeArgs,function(_,key){
					var arg = me.map[key];

					this.result.push(arg);
				},currParams);
			}

			currParams = currParams.concat(params);
			currParams.push(me);

			return currParams;
		}
	});

	return Argmap;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/toArray')
);