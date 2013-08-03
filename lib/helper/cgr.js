'use strict';

// system SGR (Select Graphic Rendition) parameters
// [ref](http://en.wikipedia.org/wiki/ANSI_escape_code)

// the most basic and simple ANSI escape code
var SGR_TABLE = {
    //styles
    'bold'              : 1, 

    // not widely supported. Sometimes treated as inverse.
    'italic'            : 3, 
    'underline'         : 4,
    'inverse'           : 7,
    'strikethrough'     : 9,

    //grayscale
    
    'gray'              : 90,

    // Intensity    0       1       2       3       4       5       6       7
    // Normal       Black   Red     Green   Yellow  Blue    Magenta Cyan    White
    
    // 8-bit non-bright version of colors 
    'black'             : 30,
    'red'               : 31,
    'green'             : 32,
    'yellow'            : 33,
    'blue'              : 34,
    'magenta'           : 35,
    'cyan'              : 36,
    'white'             : 37,

    'bg.black'          : 40,
    'bg.red'            : 41,
    'bg.green'          : 42,
    'bg.yellow'         : 43,
    'bg.blue'           : 44,
    'bg.magenta'        : 45,
    'bg.cyan'           : 46,
    'bg.white'          : 47,
};

var SUFFIX = '\x1B[0m';
var REGEX_SUFFIX = /\x1B\[\d+m$/i;
var PREFIX = '\x1B[';

Object.keys(SGR_TABLE).forEach(function(name){
    var sgr = SGR_TABLE[name];

    exports[name] = function(value) {
        return PREFIX + sgr + 'm' + value + ( REGEX_SUFFIX.test(value) ? '' : SUFFIX );
    }
});

