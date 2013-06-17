'use strict';

// module helper

var helper = module.exports = {
    helpers: {
        DEFAULT: function(value){
            return value;
        }
    }
};

function register(pattern, parser, override){
    if(typeof pattern === 'string' && typeof parser === 'function'){
        if( override || !(pattern in helper.helpers) ){
            helper.helpers[pattern] = parser;
        }
    }
};

// @param {string} pattern
// @param {function(value[, callback])} parser
//    - value: {mixed}
//  - callback: {function(err, value)} if there's `callback` arguemtn in parser, `parser` will be considered as an asynchronous method
//        - err: {Object} error object
//        - value: {mixed} parsed value
// @param {boolean=} override
helper.register = function(pattern, parser, override) {
    if(Object(pattern) === pattern){
        var patterns = pattern;
        override = parser;

        Object.keys(patterns).forEach(function(pattern) {
            var parser = patterns[pattern];

            register(pattern, parser, override);
        });

    }else{
        register(pattern, parser, override);
    }
};

