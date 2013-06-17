'use strict';

var runtime     = require('./runtime');
var parser      = require('./parser');
var helper      = require('./helper');

var typo = module.exports = {
    register: helper.register,
    helper	: helper,
    parser  : parser
};


// explode public methods
[
    'log',
    'template'

].forEach(function(method) {
    typo[method] = runtime[method];
});

// register ansi helpers
helper.register(require('./ansi'));

