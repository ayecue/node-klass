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
	Listener,
	CONSTANTS,
	Stacktrace
){
	function KlassMethod(options){
		extend(this,{
			klass: null,
			name: null,
			callback: null
		},options);
	}

	extend(KlassMethod,{
		create: function(klass,name,callback){
			var listener = new Listener(),
				method = function(){
					var self = this,
						result;

					Stacktrace.push(method);
					listener.fire('pre:call',self,[self]);
					result = callback.apply(self,arguments);
					listener.fire('post:call',self,[self,result]);
					Stacktrace.pop();

					return result;
				};

			extend(method,{
				$previous: null,
				$next: null,
				$last: null,
				$klass: klass,
				$name: name,
				$listener: listener
			});

			return method;
		}
	});

	extend(KlassMethod.prototype,{
		self: KlassMethod,

		get: function(klass){
			var me = this,
				method = me.self.create(klass || me.klass,me.name,me.callback);

			extend(method,{
				$method: me
			});

			return method;
		}
	});

	return KlassMethod;
})(
	require('../common/extend'),
	require('../Listener'),
	require('../Constants'),
	require('./Stacktrace')
);