/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var printf = require('./printf'),
	CONSTANTS = require('../constants');

/**
 *	Call parent of class
 */
module.exports = function(root,args){
	var self = this,
		name = self.getCalledMethodName();

	if (name in root) return root[name].apply(self,args || []);
	throw new Error(printf(CONSTANTS.ERRORS.NO_METHOD_FOUND,'name',name));
};