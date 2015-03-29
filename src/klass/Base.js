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
	auto,
	toArray,
	typeOf,
	Listener,
	CONSTANTS,
	Assert,
	Stacktrace,
	Property,
	Logger
){
	var DEFAULT_STATICS,
		DEFAULT_PROTOTYPES;

	function KlassBase(){
	}

	DEFAULT_STATICS = {
		//public vars
		singleton: CONSTANTS.KLASS.SINGLETON,
		debug: CONSTANTS.KLASS.DEBUGGING,
		autoSetterGetter: CONSTANTS.KLASS.AUTO,

		//internal vars
		$klassName: CONSTANTS.KLASS.BASE,
		$isKlass: true,
		$listener: new Listener(),

		//getter
		getKlass: function(){
			return this;
		},

		getName: function(){
			return this.$klassName;
		},

		getCalled : function(){
			return Stacktrace.get();
		},

		getCalledProperty : function(property){
			var called = this.getCalled();
			return called && called[property];
		},

		getCalledKlass : function(){
			return this.getCalledProperty('$klass');
		},

		getCalledName : function(){
			return this.getCalledProperty('$name');
		},

		getCalledFunction : function(){
			return this.getCalledProperty('$function');
		},

		getCalledBefore : function(){
			return this.getCalledProperty('$last');
		},

		//setter
		setProperty: function(name,value,isStatic,override){
			var me = this,
				target = me, 
				defaultPrototypes = KlassBase.$defaultStatics, 
				property;

			if (!isStatic) {
				target = me.prototype;
				defaultPrototypes = KlassBase.$defaultPrototypes;
			}

			if (!override && (name in defaultPrototypes || name in target)) {
				return me;
			}

			property = new Property({
				klass: me,
				name: name,
				value: value
			});

			value = property.get();

			if (property.isFunction()) {
				if (CONSTANTS.KLASS.DEBUGGING) {
					value.$listener
						.on('pre:call',{
							callback: me.onBeforeMethodCall,
							scope: me
						})
						.on('post:call',{
							callback: me.onAfterMethodCall,
							scope: me
						});
				}

				if (target.hasOwnProperty(name)) {
					value.$previous = target[name];
				}
			}

			target[name] = value;

			if (me.autoSetterGetter) {
				auto(target,name,value);
			}

			return me;
		},

		addStatics: function(properties){	
			this.addProperties(properties,true);
		},

		addProperties: function(properties,isStatic){
			var me = this;

			forEach(properties,function(name,value){
				me.setProperty(name,value,isStatic,true);
			});

	        return me;
		},

		addProperty: function(name,value){
			return this.setProperty(name,value,false,true);
		},

		extend: function(parent){
			var me = this,
				parentPrototype = parent.prototype,
				prototype,
				extendedEvent;

			prototype = me.prototype = Object.create(parentPrototype);
			prototype.self = me;

			me.superclass = prototype.superclass = parentPrototype;

			if (!parent.$isKlass) {
				extend(prototype,DEFAULT_PROTOTYPES);
			}

			if (parent.$listener) {
				extendedEvent = parent.$listener.get('extended').clone();
				me.$listener = new Listener();
				me.$listener.eventInstances.push(extendedEvent);
			}
		},

		override: function(properties){
			var me = this,
				statics = members.statics,
				mixins = members.mixins;

			if (statics) {
				me.addStatics(statics);
				delete properties.statics;
			}

			delete properties.mixins;

			me.addMembers(properties);

			if (mixins) {
				me.mixin(mixins);
			}

			return me;
		},

		mixin: function(name,mixinKlass){
			var me = this,
				prototype,
				mixinPrototype,
				mixins;

			if (typeof name !== 'string') {
				mixins = name;

				if (typeOf(mixins) === 'array') {
					forEach(mixins,function(_,mixin){
						me.mixin(mixin.$klassName,mixin);
					});
				} else {
					forEach(mixins,function(name,mixin){
						me.mixin(name,mixin);
					});
				}

				return;
			}

			prototype = me.prototype;
			mixinPrototype = mixinKlass.prototype;

			mixinKlass.$listener.fire('mixedin',mixinKlass,[me]);

			forEach(mixinKlass,function(name,value){
				me.setProperty(name,value,true);
			});

			forEach(mixinPrototype,function(name,value){
				me.setProperty(name,value);
			});
		},

		addSetterGetter: function(){
			var me = this,
				prototype = me.prototype;

			auto(prototype,prototype);
		},

		//functions
		callParent: function(args){
			var me = this,
				method = me.getCalled(),
				name = method.$name,
				klass = method.$klass;

			return method && (method.$previous || klass.superclass.self[name]).apply(this,args);
		},

		callSuper: function(args){
			var me = this,
				method = me.getCalled(),
				name = method.$name,
				klass = method.$klass;

			return method && klass.superclass.self[name].apply(this,args);
		},

		logMessage: function(args,error){
			Logger.print(this,args,error);
		},

		onBeforeMethodCall: function(){
			var me = this;

			Assert.d().log(CONSTANTS.MESSAGES.BASE_BEFORE_CALL,{
				klassName: me.getCalledKlass().getName(),
				method: me.getCalledName()
			});
			me.$listener.fire('beforecall',me,arguments);
		},

		onAfterMethodCall: function(){
			var me = this;

			Assert.d().log(CONSTANTS.MESSAGES.BASE_AFTER_CALL,{
				klassName: me.getCalledKlass().getName(),
				method: me.getCalledName()
			});
			me.$listener.fire('aftercall',me,arguments);
		}
	};

	DEFAULT_PROTOTYPES = {
		self: KlassBase,

		constructor: function() {
			return this;
		},

		extend: function(){
			var me = this,
				args = toArray(arguments);

			args.unshift(me);
			extend.apply(null,args);

			if (me.self.autoSetterGetter) {
				auto(me,me);
			}

			return me;
		},

		getKlass: function(){
			return this.self;
		},

		getName: function(){
			return this.self.$klassName;
		},

		getCalled : function(){
			return Stacktrace.get();
		},

		getCalledProperty : function(property){
			var called = this.getCalled();
			return called && called[property];
		},

		getCalledKlass : function(){
			return this.getCalledProperty('$klass');
		},

		getCalledName : function(){
			return this.getCalledProperty('$name');
		},

		getCalledFunction : function(){
			return this.getCalledProperty('$function');
		},

		getCalledBefore : function(){
			return this.getCalledProperty('$last');
		},

		logMessage: function(args,error){
			Logger.print(this,args,error);
		},

		callParent: function(args){
			var me = this,
				method = me.getCalled(),
				name = method.$name,
				klass = method.$klass;

			return method && (method.$previous || klass.superclass[name]).apply(this,args);
		},

		callSuper: function(args){
			var me = this,
				method = me.getCalled(),
				name = method.$name,
				klass = method.$klass;

			return method && klass.superclass[name].apply(this,args);
		}
	};

	extend(KlassBase,{
		$defaultStatics: DEFAULT_STATICS,
		$defaultPrototypes: DEFAULT_PROTOTYPES
	},DEFAULT_STATICS);

	extend(KlassBase.prototype,DEFAULT_PROTOTYPES);

	return KlassBase;
})(
	require('../common/extend'),
	require('../common/forEach'),
	require('../common/auto'),
	require('../common/toArray'),
	require('../common/typeOf'),
	require('../Listener'),
	require('../Constants'),
	require('../Assert'),
	require('./Stacktrace'),
	require('./Property'),
	require('./Logger')
);