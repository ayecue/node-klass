/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach'),
	toArray = require('./toArray'),
	printf = require('./printf'),
	CONSTANTS = require('../constants'),
	merge = require('../klass/merge'),
	config = require('../klass/config');

/**
 *	Override class
 */
module.exports = function(){
	var args = toArray(arguments),
		id = typeof args[0] == 'string' ? args.shift() : null,
		handle = config.$get(id);

	if (handle !== null) {
		forEach(args,function(_,values){
			merge(handle,values);
		});
	} else {
		throw Error(printf(CONSTANTS.ERRORS.NO_KLASS_FOUND,'name',id));
	}

	return handle;
};