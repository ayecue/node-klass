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
	Assert,
	CONSTANTS
){
	function Collection(options){
		var me = this;

		extend(me,{
			constructor: null,
			searchProperty: 'id',
			sortProperty: 'id',
			getProperty: null,
			collection: []
		},options);
	}

	extend(Collection,{
		sortTypes: {
			ASC: function(a,b){
				return b - a;
			},
			DESC: function(a,b){
				return b - a;
			}
		}
	});

	extend(Collection.prototype,{
		self: Collection,

		range: function(start,end){
			return this.collection.slice(start,end);
		},

		isEmpty: function(){
			return this.collection.length === 0;
		},

		each: function(callback,pre){
			return forEach(this.collection,callback,pre);
		},

		sort: function(type){
			var me = this,
				sortType = me.self.sortTypes[type];

			Assert.d().notNull(sortType,CONSTANTS.ERRORS.COLLECTION_INVALID_SORT_TYPE,'type',type);

			me.collection.sort(function(a,b){
				return sortType(a[me.sortProperty],b[me.sortProperty]);
			});

			return me;
		},

		indexOf: function(searchProperty){
			var me = this;

			return indexOf(me.collection,function(item){
				return item[me.searchProperty] === searchProperty;
			});
		},

		get: function(searchProperty){
			var me = this,
				idx = me.indexOf(searchProperty);

			if (idx !== -1) {
				if (me.getProperty) {
					return me.collection[idx][me.getProperty];
				}

				return me.collection[idx];
			}
		},

		getAll: function(){
			var me = this;

			return this.each(function(_,item){
				this.result.push(item[me.getProperty]);
			},[]);
		},

		getById: function(id){
			return this.collection[id];
		},

		push: function(options){
			var me = this,
				object = me.constructor ? new me.constructor(options) : options,
				idx = me.indexOf(object[me.searchProperty]);

			if (idx !== -1) {
				me.collection[idx] = object;
				return idx;
			}

			return me.collection.push(object) - 1;
		},

		remove: function(searchProperty){
			var me = this,
				idx = me.indexOf(searchProperty);

			if (idx !== -1) {
				me.collection.splice(idx,1);
				
				return true;
			}

			return false;
		},

		clone: function(){
			var me = this;

			return new me.self({
				constructor: me.constructor,
				searchProperty: me.searchProperty,
				sortProperty: me.sortProperty,
				getProperty: me.getProperty,
				collection: me.collection.slice()
			});
		}
	});

	return Collection;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/indexOf'),
	require('./Assert'),
	require('./Constants')
);