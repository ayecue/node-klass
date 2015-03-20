/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var forEach = require('../common/forEach'),
	printf = require('../common/printf'),
    regNs = require('../common/regNs'),
    decapitalize = require('../common/decapitalize'),
    config = require('./config'),
    CONSTANTS = require('../constants'),
    path = require('path'),
    async = require('async'),
    fs = require('fs');

/**
 *	Shortcuts
 */
var loadFileTpl = '<%=file%>.js';

/**
 *	Get path to file
 */
function getFilepath(name){
    var splitted = name.split('.'),
        file = splitted.pop(),
        fullFile = printf(loadFileTpl,'file',file),
        filepath = forEach(splitted,function(_,name){
            this.result.push(decapitalize(name));
        },[]);

    filepath.push(fullFile);

	return '/' + filepath.join('/');
}

function getAbsoluteFilepath(name,callback){
    var filepath = getFilepath(name),
        dir = path.dirname(config.source),
        dirP = dir.split('/'),
        dirs = [],
        last;

    while (dirP.length > 0) {
        var tempDir = dirP.join('/') + filepath;
        dirs.push(tempDir);
        dirP.pop();
    }

    async.detect(dirs, function(item,done){
        done(fs.existsSync(item) && fs.lstatSync(item).isFile());
    }, function(result){
        callback(result);
    });
}

/**
 *	Load class
 */
module.exports = function(libraries,callback){
    async.every(libraries,function(name,done){
        getAbsoluteFilepath(name,function(filepath){
            if (!filepath) {
                throw new Error(printf(CONSTANTS.ERRORS.KLASS_LOAD,'name',name));
            }

            var k = config.req(filepath);
            regNs(name,k,GLOBAL);
            done(true,k);
        });
    },function(result){
        callback(result);
    });
};