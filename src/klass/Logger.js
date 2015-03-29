/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
	forEach,
	extend,
	printf,
	CONSTANTS,
	colors
){
	function KlassLogger(){
	}

	extend(KlassLogger.prototype,{
		self: KlassLogger,

		analyze: function(context){
			var info = {};

			Error.captureStackTrace(info);

			var splittedInfo = info.stack.split('\n'),
				indexOfLine = forEach(splittedInfo,function(index,str){
					if (CONSTANTS.LOGGER.SEARCH_PATTERN.test(str)) {
						this.result = index + 1;
						this.skip = true;
					}
				},-1),
				greppedLine = splittedInfo[indexOfLine];

			if (!greppedLine) {
				return;
			} 

			// 1. link - 2. name
			var matches = greppedLine.match(CONSTANTS.LOGGER.TRACE_PATTERN);

			if (!matches) {
				return;
			}

			return printf(CONSTANTS.LOGGER.TRACE_TPL,{
				link : matches.pop(),
				name : matches.pop()
			});
		},

		/**
		 *	Generating console message templates
		 */
		toMessages: function(args){
			return forEach(args,function(_,item){
				var messages = this.result,
					type = typeof item;

				if (type == 'string') {
					messages.push('%s');
				} else if (type == 'number') {
					messages.push('%d');
				} else if (type == 'boolean') {
					messages.push('%s');
				} else {
					messages.push('%O');
				}
			},[]);
		},

		/**
		 *	Default print function to show context messages
		 */
		$print: function(context,args,error,color){
			var me = this,
				base = context.getCalledKlass(),
				contextName = base ? base.getName() : CONSTANTS.LOGGER.UNKNOWN_NAME,
				methodName = context.getCalledName() || CONSTANTS.LOGGER.ANONYMOUS_NAME,
				messages = me.toMessages(args);

			color = color || (error ? CONSTANTS.LOGGER.EXCEPTION_COLOR : CONSTANTS.LOGGER.SUCCESS_COLOR);

			if (context) {
				if (context.deepLoggingLevel || methodName == CONSTANTS.LOGGER.ANONYMOUS_NAME) {
					var deepTrace = me.analyze(context);

					console.groupCollapsed.apply(console,[('[node-klass-logger] ' + contextName + '.' + methodName + messages.join(' '))[color]].concat(args));
					console.log(('[node-klass-logger] ' + deepTrace)[color]);
					console.groupEnd();
				} else {
					console.log.apply(console,[('[node-klass-logger] ' + contextName + '.' + methodName + messages.join(' '))[color]].concat(args));
				}
			} else {
				console.log.apply(console,[('[node-klass-logger]' + messages.join(' '))[color]].concat(args));
			}
		},

		print: function(context,args,error){
			this.$print(context,[].concat(':',args),error,CONSTANTS.LOGGER.USER_COLOR);
		}
	});

	return new KlassLogger();
})(
	require('../common/forEach'),
	require('../common/extend'),
	require('../common/printf'),
	require('../Constants'),
	require('colors')
);