/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('./forEach');

module.exports = function(values,fn){
    return forEach(values,function(index,value){
        if (fn.call(this,value,index) === true) {
            this.result = index;
            this.skip = true;
        }
    },-1);
};