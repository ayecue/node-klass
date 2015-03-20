/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var call = require('./call');

/**
 *	Call parent of class
 */
module.exports = function(args,prop){
	var self = this,
		klass = self.getCalledMethodKlass(),
		parent = klass.getParent();

	if (parent) return call(parent[prop] || parent,args);
};