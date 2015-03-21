/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../common/forEach'),
	regNs = require('../common/regNs'),
	req = require;

function Shadow(){
	this.scope = {};
	this.map = {};
}

Shadow.prototype = {
	register: function(id,value,delimiter){
		var self = this;

		regNs(id,value,self.scope,function(handle,property,value){
			self.map[id] = value;

			if (handle[property]) {
				handle[property].ref = id;
			} else {
				handle[property] = {
					ref: id
				};
			}
		});
	},
	get: function(id){
		return this.map[id];
	},
	applyTo: function(scope,curr){
		var self = this;

		curr = curr || self.scope;

		if (curr.ref) {
			regNs(curr.ref,self.get(curr.ref),scope);
		}

		forEach(curr,function(_,handle){
			if (typeof handle === 'object') {
				self.applyTo(scope,handle);
			}
		});
	}
};

module.exports = Shadow;