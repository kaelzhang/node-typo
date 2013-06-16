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
        if( override && !(pattern in helper.HELPERS) ){
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
helper.register = function(pattern, p) {
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

var U;

var styles = {
    //styles
    'bold'              : ['\x1B[1m', U, '\x1B[22m'],
    'italic'            : ['\x1B[3m', U, '\x1B[23m'],
    'underline'         : ['\x1B[4m', U, '\x1B[24m'],
    'inverse'           : ['\x1B[7m', U, '\x1B[27m'],
    'strikethrough'     : ['\x1B[9m', U, '\x1B[29m'],

    //grayscale
    'white'             : ['\x1B[37m', U, '\x1B[39m'],
    'grey'              : ['\x1B[90m', U, '\x1B[39m'],
    'black'             : ['\x1B[30m', U, '\x1B[39m'],
    
    //colors
    'blue'              : ['\x1B[34m', U, '\x1B[39m'],
    'cyan'              : ['\x1B[36m', U, '\x1B[39m'],
    'green'             : ['\x1B[32m', U, '\x1B[39m'],
    'magenta'           : ['\x1B[35m', U, '\x1B[39m'],
    'red'               : ['\x1B[31m', U, '\x1B[39m'],
    'yellow'            : ['\x1B[33m', U, '\x1B[39m']
};

Object.keys(styles).forEach(function(style) {
    var pattern = styles[style];

    helper.helpers[style] = function(value) {
        pattern[1] = value;
        return pattern.join('');
    }
});

