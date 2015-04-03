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
	printf,
	from,
	decapitalize,
	indexOf,
	emptyFn,
	Argmap,
	Assert,
	Collection,
	CONSTANTS,
	Autoloader,
	path,
    async,
    fs
){
	function Loader(options){
		extend(this,{
			manager: null,

			autoloader: new Autoloader(),

			cache: new Collection({
				searchProperty: 'filepath',
				getProperty: 'absolutepath'
			}),
			enableCache: true,

			parseCache: new Collection({
				searchProperty: 'name',
				getProperty: 'filepath'
			}),
			enableParseCache: true
		},options);
	}

	extend(Loader.prototype,{
		self: Loader,
		sourcePath: __filename,
		loadFileTpl: '<%=file%>',

		setSource: function(sourcePath){
			this.sourcePath = sourcePath;
			return this;
		},

		parse: function(name){
			var me = this,
				filepath = me.enableParseCache && me.parseCache.get(name),
				parts, file;

			if (filepath) {
				return filepath;
			}

			parts = name.split('.');

			file = parts.pop();

			filepath = forEach(parts,function(_,name){
	            this.result.push(decapitalize(name));
	        },[]);
		    filepath.push(file);
		    filepath = '/' + filepath.join('/');

		    if (me.enableParseCache) {
				me.parseCache.push({
					name: name,
					filepath: filepath
				});
		    }

			return filepath;
		},

		resolve: function(name,done){
		    var me = this,
		    	filepath = me.parse(name),
		    	absolutepath = me.enableCache && me.cache.get(filepath),
		    	dirparts, dirs, currdir;

		    if (absolutepath) {
				return done(absolutepath);
			}

			me.autoloader.get(me.sourcePath,filepath,function(result){
				if (me.enableCache) {
					me.cache.push({
						filepath: filepath,
						absolutepath: result
					});
				}

				Assert.d().log(CONSTANTS.MESSAGES.CORE_RESOLVE_DEP,{
					name: name,
					filepath: result
				});

				done(result);
			});
		},

		require: function(deps,done){
			var me = this,
				fire = function(name){
					var dep = me.manager.getKlass(name) || me.manager.get(name);

					missing.remove(name);
					argMap.set(name,dep);

					if (missing.isEmpty()) {
						done.apply(me,argMap.collect());
					}
				},
				argMap, missing;

			if (typeof deps === 'string') {
				deps = from(deps);
			}

			argMap = new Argmap({
				includeArgs: deps
			});

			if (deps.length > 0) {
				missing = forEach(deps,function(_,name){
					var isExternal = /^!/.test(name),
						dep;

					if (isExternal) {
						name = name.substring(1);
					}

					dep = me.manager.getKlass(name) || me.manager.get(name);

					if (!dep) {
						this.result.push({
							name: name,
							isExternal: isExternal
						});
					} else {
						argMap.set(name,dep);
					}
				},new Collection({
					searchProperty: 'name',
					getProperty: 'name'
				}));

				if (!missing.isEmpty()) {
					me.manager.addListener(fire,missing.getAll());

					async.every(missing.range(),function(item,done){
						me.resolve(item.name,function(filepath){
							Assert.d(true).notNull(filepath,CONSTANTS.ERRORS.KLASS_LOADER_INVALID_PATH,'name',item.name);

							var resolved = require(filepath);

							if (item.isExternal) {
								me.manager.set(item.name,resolved);
								fire(item.name);
							}

							done(true,resolved);
						});
					},emptyFn);

					return;
				}
			}

			done.apply(me,argMap.collect());
		}
	});

	return Loader;
})(
	require('./common/extend'),
	require('./common/forEach'),
	require('./common/printf'),
	require('./common/from'),
	require('./common/decapitalize'),
	require('./common/indexOf'),
	require('./common/emptyFn'),
	require('./Argmap'),
	require('./Assert'),
	require('./Collection'),
	require('./Constants'),
	require('node-cjs-autoloader'),
	require('path'),
    require('async'),
	require('fs')
);