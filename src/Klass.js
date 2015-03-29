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
	toArray,
	forEach,
	printf,
	capitalize,
	CONSTANTS,
	Assert,
	Base
){
	function Klass(options){
		var me = this;	

		extend(me,{
			klass: null,
			values: null,
			processor: null,
			callback: null
		},options);

		me.create().process();

		return me.klass;
	}

	extend(Klass,{
		createConstructor: function(id){
			var parts = id.split('.'),
				property, klass;

			parts = forEach(parts,function(_,part){
				this.result.push(capitalize(part));
			},[]);
			property = parts.join('');
			klass = printf(CONSTANTS.KLASS.TEMPLATE,'name',property);

			try {
				return new Function(klass)();
			} catch(e) {
				Assert.d().expection(CONSTANTS.ERRORS.KLASS_EVAL,{
					code: klass,
					message: e.message
				});
			}
		}
	});

	extend(Klass.prototype,{
		self: Klass,

		create: function(){
			var me = this;

			if (!me.klass) {
				me.klass = this.self.createConstructor(me.values.$klassName);
			}

			extend(me.klass,Base.$defaultStatics);

			return me;
		},

		process: function(){
			var me = this,
				batch = me.processor.batch('pre',me,me.values,{
					klass: me.klass
				});

			batch.hooks
				.on('processed',{
					scope: me,
					callback: me.onProcessed
				})
				.on('created',{
					scope: me,
					callback: me.callback
				});

			batch.argMap.setIncludeArgs('klass','values','hooks');
			batch.process();

			return me;
		},

		onProcessed: function(klass,values,hooks){
			var me = this;

			klass.addProperties(values);
			hooks.fire('created',me,arguments);
		}
	});

	return Klass;
})(
	require('./common/extend'),
	require('./common/toArray'),
	require('./common/forEach'),
	require('./common/printf'),
	require('./common/capitalize'),
	require('./Constants'),
	require('./Assert'),
	require('./klass/Base')
);