/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Shadow = require('./shadow'),
	req = require;

function Config(){
	this.req = req;
	this.source = req.main.filename;
	this.scope = GLOBAL || {};
	this.$shadow = new Shadow();
	this.$dependencyMap = new Shadow();
}

Config.prototype = {
	setScope: function(scope){
		this.scope = scope;
		this.$shadow.applyTo(this.scope);
		return this;
	},

	setSource: function(source){
		this.source = source;
		return this;
	},

	getScope: function(){
		return this.scope;
	},

	getSource: function(){
		return this.source;
	},

	//internal
	$reg: function(id,object){
		this.$shadow.register(id,object);
		if (this.scope) {
			this.$shadow.applyTo(this.scope);
		}
	},

	$get: function(id){
		return this.$shadow.get(id);
	},

	$regDep: function(id,object){
		this.$dependencyMap.register(id,object);
	},

	$getDep: function(id){
		this.$dependencyMap.get(id);
	}
};

module.exports = new Config();