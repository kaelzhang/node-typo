'use strict';

var typo = module.exports = {};

var runtime = require('./runtime');

typo.helper = require('./helper');
typo.parser = require('./parser');

[
	'log',
	'template'

].forEach(function(method) {
	typo[method] = runtime[method];
});



