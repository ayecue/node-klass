/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach');

function set(handle,property,value){
	return handle[property] = value || {};
}

/**
 *	Create namespace
 */
module.exports = function(id,value,root,customSet,delimiter){
	var namespaces = id.split(delimiter || '.'),
		last = namespaces.pop(),
		handle = forEach(namespaces,function(index,value){
			this.result = this.result[value] || (this.result[value] = {});
		},root);

	return (customSet || set)(handle,last,value);
};