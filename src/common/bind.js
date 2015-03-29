/*
 * node-klass
 * https://github.com/ayecue/node-klass
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = (function(
    toArray,
    typeOf
){
    return function(fn, scope, args, append) {
        if (args != null) {
            if (typeOf(args) !== 'array') {
                args = toArray(args);
            }

            return function() {
                var currentArgs = toArray(arguments);

                if (append === true) {
                    currentArgs = currentArgs.concat(args);
                }

                return method.apply(scope || this, currentArgs);
            };
        }

        return function() {
            return fn.apply(scope, arguments);
        };
    };
})(
    require('./toArray'),
    require('./typeOf')
);