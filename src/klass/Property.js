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
	CONSTANTS,
	Method
){
	function KlassProperty(options){
		extend(this,{
			klass: null,
			name: null,
			value: null
		},options);
	}

	extend(KlassProperty.prototype,{
		self: KlassProperty,

		isFunction: function(){
			return typeof this.value === 'function' && !this.value.$isKlass;
		},

		isKlass: function(){
			return typeof this.value === 'function' && this.value.$isKlass;
		},

		get: function(){
			var me = this,
				value = me.value;

			if (me.isFunction()) {
				if (value.$method) {
					value = value.$method.get(me.klass);
				} else {
					value = new Method({
						klass: me.klass,
						name: me.name,
						callback: me.value
					}).get();
				}
			}

			return value;
		}
	});

	return KlassProperty;
})(
	require('../common/extend'),
	require('../Constants'),
	require('./Method')
);