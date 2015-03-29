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
	typeOf,
	emptyFn,
	CONSTANTS,
	References,
	Processor,
	Map,
	Listener,
	Event,
	Klass,
	Collection,
	async
){
	function Manager(options){
		var me = this;

		extend(me,{
			map: new Map(),
			refs: new References(),
			listener: new Listener(),
			processor: null,

			klasses: new Collection({
				searchProperty: 'namespace',
				getProperty: 'handle'
			}),
			namespaces: new Collection({
				searchProperty: 'id',
				getProperty: 'klass'
			})
		},options);
	}

	extend(Manager.prototype,{
		self: Manager,

		create: function(id,values,done){
			var me = this,
				klass = Klass.createConstructor(id);

			if (typeof values === 'function') {
				values = values(klass);
			}

			me.klasses.push({
				namespace: id,
				handle: klass
			})

			values.$klassName = id;

			return new Klass({
				klass: klass,
				values: values,
				processor: me.processor,
				callback: function(klass){
					var batch = me.processor.batch('post',me,values,{
							id: id,
							klass: klass
						});

					batch.hooks
						.on('processed',{
							scope: me,
							callback: me.onProcessed
						})
						.on('created',{
							scope: me,
							callback: done || emptyFn
						});

					batch.argMap.setIncludeArgs('id','klass','values','hooks');
					batch.process();
				}
			});
		},

		createOverride: function(id,values,done){
			var me = this,
				tasks = new Collection({
					searchProperty: 'name',
					getProperty: 'callback'
				}),
				overrideKlass = values.override,
				mixins = values.mixins,
				requires = values.requires,
				mixinDeps;

			if (typeof overrideKlass === 'string') {
				tasks.push({
					name: 'override',
					callback: function(done){
						loader.require(overrideKlass,function(parent){
							if (parent) {
								values.override = parent;
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

			if (!tasks.isEmpty()) {
				async.parallel(tasks.getAll(),function(err,results){
					me.createOverride(id,values,done);
				});

				return me;
			}

			delete values.extends

			overrideKlass.override(values);
			done.call(overrideKlass,overrideKlass);

			return me;
		},

		define: function (id,values,done) {
			var me = this;

			if (values.override) {
				return me.createOverride.apply(me, arguments);
			}

			return me.create.apply(me, arguments);
		},

		onProcessed: function(id,klass,values,hooks){
			var me = this,
				klassEvent = 'created:' + id;

			me.set(id,klass);
			hooks.fire('created',me,arguments);
			me.listener
				.fire('created',me,arguments)
				.fire(klassEvent,me,arguments)
				.remove(klassEvent);
		},

		addListener: function(callback,id){
			var me = this,
				eventParts,
				klass;

			if (typeOf(id) === 'array') {
				return forEach(id,function(_,name){
					me.addListener(callback,name);
				});
			}

			if (id) {
				klass = me.klasses.get(id);

				if (klass) {
					callback.call(me,klass);
					return;
				}

				me.listener.on('created:' + id,callback);
				return;
			}

			me.listener.on('created',callback);
		},

		setScope: function(scope){
			this.map.scope = scope;
			return this;
		},

		set: function(id,klass){
			var me = this,
				ref = me.refs.get(id),
				childs;

			if (ref) {
				childs = forEach(ref.children,function(_,child){
					this.result.push({
						id: child.id,
						value: me.map.get(child.id)
					});
				},[]);
			} else {
				me.refs.set(id);
			}

			me.map.set(id,klass);

			if (childs) {
				forEach(childs,function(_,child){
					me.map.set(child.id,child.value);
				});
			}

			me.namespaces.push({
				id: id,
				klass: klass
			});
		},

		get: function(id){
			return this.namespaces.get(id);
		},

		getKlass: function(id){
			return this.klasses.get(id);
		}
	});

	return Manager;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/typeOf'),
	require('./common/emptyFn'),
	require('./Constants'),
	require('./manager/References'),
	require('./Processor'),
	require('./Map'),
	require('./Listener'),
	require('./Event'),
	require('./Klass'),
	require('./Collection'),
	require('async')
);