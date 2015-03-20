/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var extend = require('../common/extend'),
	forEach = require('../common/forEach'),
	getNs = require('../common/getNs'),
	regNs = require('../common/regNs'),
	merge = require('./merge'),
	config = require('./config'),
	register = require('./register'),
	load = require('./load');

/**
 *	Shortcuts
 */
var defaultProperties = {'extends':single,'mixins':object,'requires':array};

function single(value){
	if (typeof value == 'string' && config.$get(value) === null && getNs(value,config.$dependencyMap) === null) {
		regNs(value,{pending:false},config.$dependencyMap);
		return [value];
	}
}

function object(values){
	var result = [];
	return forEach(values,function(_,value){
		var lib = single(value);
		lib && (this.result = result = result.concat(lib));
	});
}

function array(values){
	return values instanceof Array ? object(values) : single(values);
}

module.exports = function(handle,values){
	var libraries = [],
		properties = extend({},defaultProperties),
		className = handle.$classname,
		myState = getNs(className,config.$dependencyMap),
		done = function(){
			merge(handle,values);
			register(handle);
		};

	!myState && regNs(handle.$classname,myState = {pending:true},config.$dependencyMap);

	forEach(defaultProperties,function(key,fn){
		if (key in values) {
			var libs = fn(values[key],libraries);
			if (libs) {
				libraries = libraries.concat(libs);
			}
		}
	});

	libraries.length ? load(libraries,done) : done();
};