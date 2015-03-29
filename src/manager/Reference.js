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
	CONSTANTS
){
	function ManagerReference(options){
		var me = this;

		extend(me,{
			id: null,
			children: []
		},options);
	}

	extend(ManagerReference.prototype,{
		self: ManagerReference,

		indexOf: function(id){
			var me = this;

			return indexOf(me.children,function(ref){
				return ref.id === id;
			});
		},

		get: function(id){
			var me = this,
				idx = me.indexOf(id);

			return me.children[idx];
		},

		push: function(id){
			var me = this,
				idx = me.indexOf(id),
				newRef;

			if (idx === -1) {
				newRef = new me.self({
					id: id
				});

				idx = me.children.push(newRef) - 1;
			}

			return  me.children[idx];
		}
	});

	return ManagerReference;
})(
	require('../common/extend'),
	require('../common/indexOf'),
	require('../Constants')
);