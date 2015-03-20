/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

exports.ERRORS = {
	NO_METHOD_FOUND : 'Method <%= name %> do not exist.',
	NO_KLASS_FOUND : '<%= name %> do not exist.',
	KLASS_LOAD : 'Cannot find class <%= name %>.',
	EVAL : 'Compile exception in code: <%= code %> (%message%)'
};

exports.KLASS = {
	DEBUGGING : false,
	SINGLETON : false,
	AUTO : true,
	TEMPLATE : 'return function <%= name %>(){this._init && this._init();return this.constructor.apply(this, arguments) || null;};'
};

exports.LOGGER = {
	EXCEPTION_COLOR : '#D8000C',
	SUCCESS_COLOR : '#4F8A10',
	USER_COLOR : '#008B8B',
	UNKNOWN_NAME : 'unknown',
	ANONYMOUS_NAME : 'anonymous',
	SEARCH_PATTERN : /pLogMessage/i,
	TRACE_PATTERN : /at\s(\S+)\s[^\(]*\(([^\)]+)\)/i,
	TRACE_TPL : '${<%=name%>} (<%=link%>)',
	STYLE_TPL : 'color:<%=hexcode%>;'
};