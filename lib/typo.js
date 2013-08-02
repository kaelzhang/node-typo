'use strict';

module.exports = Typo;

var substitute = require('./runtime');
var Stream = require('stream');
var util = require('util');

function mix (receiver, supplier, override){
    var key;

    if(arguments.length === 2){
        override = true;
    }

    for(key in supplier){
        if(override || !(key in receiver)){
            receiver[key] = supplier[key]
        }
    }

    return receiver;
}


util.inherits(Typo, Stream);


// @param {Object} options
// - output: {Stream.Writeable}
// - clean: {boolean} if true, typo will not output SGR charactors
function Typo (options) {
    options = options || {};

    this._clean = options.clean;
    this._helpers = new helpers_creator();

    var output = options.output;

    output && this.pipe(output);
};


Typo.prototype.write = function (template, params, callback) {
    var self = this;

    this.template(template, params, function(err, value) {
        if(err){
            return callback && callback(err);
        }

        self.emit('data', value);

        callback && callback(null, value);
    });
};


Typo.prototype.log = function (template, params, callback) {
    this.write(template + '\n', params, callback);
};


Typo.prototype.template = function (template, params, callback) {
    if(arguments.length === 2 && typeof params === 'function'){
        callback = params;
        params = {};
    }

    return substitute(template, params, this._helpers, callback);
};


// @param {string} pattern
// @param {function(value[, callback])} parser
//    - value: {mixed}
//  - callback: {function(err, value)} if there's `callback` arguemtn in parser, `parser` will be considered as an asynchronous method
//        - err: {Object} error object
//        - value: {mixed} parsed value
// @param {boolean=} override
Typo.prototype.register = function(pattern, parser, override) {
    var self = this;

    if(Object(pattern) === pattern){
        var patterns = pattern;
        override = parser;

        for(pattern in patterns){
            parser = patterns[pattern];
        }

        this._register(pattern, parser, override);

    }else{
        this._register(pattern, parser, override);
    }
};


Typo.prototype._register = function (pattern, parser, override){
    if(typeof pattern === 'string' && typeof parser === 'function'){
        if( override || !(pattern in this._helpers) ){
            this._helpers[pattern] = parser;
        }
    }
};


Typo.prototype.clean = function (string) {
};


var helpers = {};

function helpers_creator(){};
helpers_creator.prototype = helpers;

// register ansi helpers
mix(helpers, require('./helper/cgr'));
mix(helpers, require('./helper/rgb'));


