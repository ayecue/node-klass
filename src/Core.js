/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	bind,
	capitalize,
	decapitalize,
	extend,
	forEach,
	from,
	id,
	indexOf,
	printf,
	toArray,
	typeOf,
	log,
	emptyFn,
	applyIf,
	CONSTANTS,
	Argmap,
	Assert,
	Listener,
	Event,
	Map,
	Callback,
	Collection,
	Processor,
	Base,
	Manager,
	Loader,
	async
){
	function Core(options){
		var me = this,
			processor = new Processor({
				types: me.types
			}),
			manager = new Manager({
				processor: processor
			}),
			loader = new Loader({
				manager: manager
			});

		extend(me,{
			processor: processor,
			manager: manager,
			loader: loader,
			map: new Map({
				enableCache: false
			})
		},options);

		processor.registerAll({
			type: 'pre',
			config: {
				name: 'klassName',
				priority: CONSTANTS.PRIORITY.HIGH,
				ignoreFilter: true,
				process: function(klass,values,hooks){
					log(CONSTANTS.MESSAGES.CORE_EXTEND_KLASSNAME,'id',values.$klassName);

					if ('$klassName' in values) {
						klass.$klassName = values.$klassName;
					}
				}
			}
		},{
			type: 'pre',
			config: {
				name: 'loader',
				priority: CONSTANTS.PRIORITY.HIGH,
				ignoreFilter: true,
				process: function(klass,values,hooks,done){
					log(CONSTANTS.MESSAGES.CORE_LOAD_DEPS,'id',klass.getName());

					var tasks = new Collection({
							searchProperty: 'name',
							getProperty: 'callback'
						}),
						extend = values.extends,
						mixins = values.mixins,
						requires = values.requires,
						mixinDeps;

					if (typeof extend === 'string') {
						tasks.push({
							name: 'extend',
							callback: function(done){
								loader.require(extend,function(parent){
									if (parent) {
										values.extends = parent;
									}

									done();
								});
							}
						});
					}

					if (mixins) {
						mixinDeps = forEach(mixins,function(_,mixin){
							if (typeof mixin === 'string') {
								this.result.push(mixin);
							}
						},[]);

						if (mixinDeps.length !== 0) {
							tasks.push({
								name: 'mixin',
								callback: function(done){
									loader.require(mixinDeps,function(){
										forEach(mixins,function(property,mixin){
											mixins[property] = manager.getKlass(mixin);
										});

										done();
									});
								}
							});
						}
					}

					if (requires) {
						tasks.push({
							name: 'requires',
							callback: function(done){
								loader.require(requires,function(){
									done();
								});
							}
						});

						delete values.requires;
					}

					if (tasks.isEmpty()) {
						return true;
					}

					async.parallel(tasks.getAll(),function(err,results){
						done();
					});

					return false;
				}
			}
		},{
			type: 'pre',
			config: {
				name: 'extends',
				ignoreFilter: true,
				process: function(klass,values,hooks,done){
					var parent = values.extends;
					delete values.extends;

					if (typeof parent === 'string') {
						parent = manager.getKlass(parent);
					}

					if (typeof parent !== 'function') {
			            parent = Base;
			        }

			        log(CONSTANTS.MESSAGES.CORE_EXTEND_PARENT,{
			        	id: klass.getName(),
			        	parentId: parent.getName()
			        });

					klass.extend(parent);
					klass.$listener.fire('extended',arguments);

					if (values.onClassExtended) {
						klass.$listener.on('extended',{
							callback: values.onClassExtended,
							scope: klass
						});
						delete values.onClassExtended;
					}
				}
			}
		},{
			type: 'pre',
			config: {
				name: 'statics',
				process: function(klass,values,hooks,done){
					log(CONSTANTS.MESSAGES.CORE_EXTEND_STATICS,'id',klass.getName());
					klass.addStatics(values.statics);
					delete values.statics;
				}
			}
		},{
			type: 'pre',
			config: {
				name: 'mixins',
				process: function(klass,values,hooks,done){
					log(CONSTANTS.MESSAGES.CORE_EXTEND_MIXINS,'id',klass.getName());

					var mixins = values.mixins;

					hooks.on('created',{
						priority: CONSTANTS.PRIORITY.HIGH,
						callback: function(){
							klass.mixin(mixins);
						}
					});
				}
			}
		},{
			type: 'pre',
			config: {
				name: 'config',
				process: function(klass,values,hooks,done){
					log(CONSTANTS.MESSAGES.CORE_EXTEND_CONFIG,'id',klass.getName());
				}
			}
		},{
			type: 'post',
			config: {
				name: 'singleton',
				process: function(id,klass,values,hooks,done,argMap){
					log(CONSTANTS.MESSAGES.CORE_CREATE_SINGLETON,'id',id);

					if (values.singleton) {
						argMap.set('klass',new klass());
						done();
					} else {
						return true;
					}

					return false;
				}
			}
		});
	}

	extend(Core.prototype,{
		self: Core,
		instance: null,
		types: ['pre','post'],

		setScope: function(){
			var me = Core.instance;
			me.manager.setScope.apply(me.manager,arguments);
			return me;
		},

		define: function(){
			var me = Core.instance;
			return me.manager.define.apply(me.manager,arguments);
		},

		createOverride: function(){
			var me = Core.instance;
			return me.manager.createOverride.apply(me.manager,arguments);
		},

		setNamespace: function(id,value,scope){
			var me = Core.instance;
			me.map.scope = scope || me.manager.map.scope;
			me.map.set(id,value);
			return me;
		},

		getNamespace: function(id,scope){
			var me = Core.instance;
			me.map.scope = scope || me.manager.map.scope;
			return me.map.get(id);
		},

		get: function(){
			var me = Core.instance;
			return me.manager.get.apply(me.manager,arguments);
		},

		getKlass: function(){
			var me = Core.instance;
			return me.manager.getKlass.apply(me.manager,arguments);
		},

		setSource: function(){
			var me = Core.instance;
			me.loader.setSource.apply(me.loader,arguments);
			return me;
		},

		require: function(){
			var me = Core.instance;
			me.loader.require.apply(me.loader,arguments);
			return me;
		},

		Argmap: Argmap,
		Assert: Assert,
		Listener: Listener,
		Event: Event,
		Map: Map,
		Callback: Callback,
		Collection: Collection,

		bind: bind,
		capitalize: capitalize,
		decapitalize: decapitalize,
		extend: extend,
		forEach: forEach,
		from: from,
		id: id,
		indexOf: indexOf,
		printf: printf,
		toArray: toArray,
		typeOf: typeOf,
		log: log,
		emptyFn: emptyFn,
		applyIf: applyIf
	});

	return Core.instance = new Core();
})(
	require('./common/bind'),
	require('./common/capitalize'),
	require('./common/decapitalize'),
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/from'),
	require('./common/id'),
	require('./common/indexOf'),
	require('./common/printf'),
	require('./common/toArray'),
	require('./common/typeOf'),
	require('./common/log'),
	require('./common/emptyFn'),
	require('./common/applyIf'),
	require('./Constants'),
	require('./Argmap'),
	require('./Assert'),
	require('./Listener'),
	require('./Event'),
	require('./Map'),
	require('./Callback'),
	require('./Collection'),
	require('./Processor'),
	require('./klass/Base'),
	require('./Manager'),
	require('./Loader'),
	require('async')
);