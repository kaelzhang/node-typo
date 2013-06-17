'use strict';

var runtime     = require('./runtime');
var parser      = require('./parser');
var helper      = require('./helper');

var typo = module.exports = {
    register: helper.register,
    helper	: helper,
    parser  : parser,
    util	: {}
};


// explode public methods
[
    'log',
    'template'

].forEach(function(method) {
    typo[method] = runtime[method];
});

typo.util.RGB = require('./util/rgb');

// register ansi helpers
helper.register(require('./helper/cgr'));
helper.register(require('./helper/rgb'));



