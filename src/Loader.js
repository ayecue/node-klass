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
	path,
    async,
    fs
){
	function Loader(options){
		extend(this,{
			manager: null,

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
		loadFileTpl: '<%=file%>.js',

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
			file = printf(me.loadFileTpl,'file',file);

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

			dirparts = path.dirname(me.sourcePath);
			dirparts = dirparts.split('/');
			dirs = [];

		    while (dirparts.length > 0) {
		        currdir = dirparts.join('/') + filepath;
		        dirs.push(currdir);
		        dirparts.pop();
		    }

		    async.detect(dirs, function(item,done){
		        done(fs.existsSync(item) && fs.lstatSync(item).isFile());
		    }, function(result){
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
				argMap, missing;

			if (typeof deps === 'string') {
				deps = from(deps);
			}

			argMap = new Argmap({
				includeArgs: deps
			});

			if (deps.length > 0) {
				missing = forEach(deps,function(_,id){
					var dep = me.manager.getKlass(id);

					if (!dep) {
						this.result.push(id);
					} else {
						argMap.set(id,dep);
					}
				},[]);

				if (missing.length > 0) {
					me.manager.addListener(function(id){
						var dep = me.manager.getKlass(id),
							idx = indexOf(missing,function(m){
								return m === id;
							});

						missing.splice(idx,1);
						argMap.set(id,dep);

						if (missing.length === 0) {
							done.apply(me,argMap.collect());
						}
					},missing);

					async.every(deps,function(name,done){
				        me.resolve(name,function(filepath){
				        	Assert.d(true).notNull(filepath,CONSTANTS.ERRORS.KLASS_LOADER_INVALID_PATH,'name',name);
				            done(true,require(filepath));
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
	require('path'),
    require('async'),
	require('fs')
);