'use strict';

var typo = module.exports = {};

var runtime = require('./runtime');

typo.parser = require('./parser');
typo.helper = require('./helper');

typo.register = typo.helper.register;


[
	'log',
	'template'

].forEach(function(method) {
	typo[method] = runtime[method];
});



