/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var regNs = require('./common/regNs'),
	getNs = require('./common/getNs'),
	extend = require('./common/extend'),
	config = require('./klass/config');

module.exports = {
	setConfig: function(options){
		extend(config,options);
		return this;
	},
	getConfig: function(){
		return config;
	},
	set: function(name,object){
		return config.$reg(name,object);
	},
	get: function(name){
		return config.$get(name);
	},
	define: require('./klass/factory'),
	require: require('./klass/load'),
	//common
	override: require('./common/override'),
	capitalize: require('./common/capitalize'),
	decapitalize: require('./common/decapitalize'),
	registerNamespace: regNs,
	getNamespace: getNs,
	extend: extend,
	toArray: require('./common/toArray'),
	from: require('./common/from'),
	typeOf: require('./common/typeOf'),
	indexOf: require('./common/indexOf'),
	id: require('./common/id'),
	applyIf: require('./common/applyIf')
};