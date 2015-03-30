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
	error,
	log,
	typeOf,
	CONSTANTS
){
	function Assert(doThrow){
		extend(this,{
			doThrow: doThrow || false,
			doLog: CONSTANTS.KLASS.ASSERTLOG
		});
	}

	extend(Assert,{
		d: function(doThrow){
			return new this(doThrow);
		}
	});

	extend(Assert.prototype,{
		self: Assert,

		doThrow: function(){
			this.doThrow = true;
			return this;
		},

		notThrow: function(){
			this.doThrow = false;
			return this;
		},

		doLog: function(){
			this.doLog = true;
			return this;
		},

		notLog: function(){
			this.doLog = false;
			return this;
		},

		isError: function(){
			return this.doThrow;
		},

		isLog: function(){
			return !this.doThrow && this.doLog;
		},

		isNull: function(value,tpl,prop,logval){
			var me = this,
				isExpected = value === null || value === undefined;

			if (!isExpected) {
				me.expection(tpl,prop,logval);
			}

			return isExpected;
		},

		notNull: function(value,tpl,prop,logval){
			var me = this,
				isExpected = value !== null && value !== undefined;

			if (!isExpected) {
				me.expection(tpl,prop,logval);
			}

			return isExpected;
		},

		unequal: function(value,expect,tpl,prop,logval){
			var me = this,
				isExpected = value !== expect;

			if (!isExpected) {
				me.expection(tpl,prop,logval);
			}

			return isExpected;
		},

		equal: function(value,expect,tpl,prop,logval){
			var me = this,
				isExpected = value === expect;

			if (!isExpected) {
				me.expection(tpl,prop,logval);
			}

			return isExpected;
		},

		notType: function(value,expect,tpl,prop,logval){
			var me = this,
				isExpected = typeOf(value) !== expect;

			if (!isExpected) {
				me.expection(tpl,prop,logval);
			}

			return isExpected;
		},

		isType: function(value,expect,tpl,prop,logval){
			var me = this,
				isExpected = typeOf(value) === expect;

			if (!isExpected) {
				me.expection(tpl,prop,logval);
			}

			return isExpected;
		},

		expection: function(tpl,prop,logval){
			var me = this;

			if (me.isError()) {
				throw error(tpl,prop,logval);
			}

			me.log(tpl,prop,logval);
		},

		log: function(tpl,prop,logval){
			var me = this;

			if (me.isLog()) {
				log(tpl,prop,logval);
			}
		}
	});

	return Assert;
})(
	require('./common/extend'),
	require('./common/error'),
	require('./common/log'),
	require('./common/typeOf'),
	require('./Constants')
);