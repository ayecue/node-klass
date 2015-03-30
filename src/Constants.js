/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var colors = require('colors');

exports.ERRORS = {
	KLASS_LOADER_INVALID_PATH: '[node-klass] Cannot find class <%= name %>.'.red,
	KLASS_EVAL: '[node-klass] Compile exception in code: <%= code %> (<%= message %>)'.red,
	EXPOSE_INVALID_PROPERTY: '[node-klass] Property <%= prop %> not found.'.red,
	LOG_INVALID_TYPE: '[node-klass] Type have to be a string.'.red,
	COLLECTION_INVALID_SORT_TYPE: '[node-klass] Invalid sorting type <%= type %>.'.red
};

exports.MESSAGES = {
	CORE_LOAD_DEPS: '[node-klass] Load dependencies for <%= id %>.'.yellow,
	CORE_RESOLVE_DEP: '[node-klass] Resolve dependency <%= name %> from <%= filepath %>.'.yellow,
	CORE_EXTEND_KLASSNAME: '[node-klass] Extend klassName to <%= id %>.'.yellow,
	CORE_EXTEND_CONFIG: '[node-klass] Extend config to <%= id %>.'.yellow,
	CORE_EXTEND_MIXINS: '[node-klass] Extend mixins to <%= id %>.'.yellow,
	CORE_EXTEND_STATICS: '[node-klass] Extend statics to <%= id %>.'.yellow,
	CORE_EXTEND_PARENT: '[node-klass] Extend parent <%= parentId %> to <%= id %>.'.yellow,
	CORE_CREATE_SINGLETON: '[node-klass] Create singleton class <%= id %>.'.yellow,
	BASE_BEFORE_CALL: '[node-klass] Before call of <%= method %> in <%= klassName %>.'.magenta,
	BASE_AFTER_CALL: '[node-klass] After call of <%= method %> in <%= klassName %>.'.magenta
};

exports.KLASS = {
	BASE: 'Base',
	ASSERTLOG: false,
	DEBUGGING: false,
	SINGLETON: false,
	AUTO: true,
	SETTER: 'set<%=:olettersnumber,camelcase:keyword%>',
	GETTER: 'get<%=:olettersnumber,camelcase:keyword%>',
	TEMPLATE: 'return function <%= name %>(){return this.constructor.apply(this, arguments) || null;};'
};

exports.PRIORITY = {
	LOW: 5,
	MIDDLE: 45,
	HIGH: 75
};

exports.LOGGER = {
	EXCEPTION_COLOR: 'red',
	SUCCESS_COLOR: 'green',
	USER_COLOR: 'cyan',
	UNKNOWN_NAME: 'unknown',
	ANONYMOUS_NAME: 'anonymous',
	SEARCH_PATTERN: /pLogMessage/i,
	TRACE_PATTERN: /at\s(\S+)\s[^\(]*\(([^\)]+)\)/i,
	TRACE_TPL: '${<%=name%>} (<%=link%>)'
};