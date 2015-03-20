/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var getNs = require('../common/getNs'),
	regNs = require('../common/regNs'),
	extend = require('../common/extend'),
	req = require;

function initConfig(){
	return {
		req: req,
		source: req.main.filename,
		scope: GLOBAL || {},

		setScope: function(scope){
			this.scope = scope;
			extend(scope,this.$scope);
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
		$dependencyMap: {},
		$scope: {},

		$reg: function(id,object){
			if (this.scope) {
				regNs(id,object,this.scope);
			}
			return regNs(id,object,this.$scope);
		},

		$get: function(id){
			return getNs(id,this.$scope);
		},
	};
};

module.exports = initConfig();