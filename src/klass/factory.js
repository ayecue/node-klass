/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var toArray = require('../common/toArray'),
	extend = require('../common/extend'),
	id = require('../common/id'),
	compiler = require('./compiler'),
	statics = require('./statics'),
	prototypes = require('./prototypes'),
	merge = require('./merge'),
	register = require('./register'),
	loader = require('./loader');

/**
 *	Create pseudo class
 */
module.exports = function(name,values,callback){
	if (typeof name !== 'string') {
		name = id();
		values = id;
		callback = values;
	}

	var handle = compiler(name);
	
	extend(handle,statics(name,handle));
	extend(handle.prototype,prototypes(name,handle));
	loader(handle,values,callback);

	return handle;
};