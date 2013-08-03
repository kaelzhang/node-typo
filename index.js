'use strict';

var Typo = require('./lib/typo');

module.exports = typo;


function typo(options){
    return new Typo(options);
};

typo.Typo = Typo;


// util method of RGB
typo.util = {
    RGB: require('./lib/util/rgb')
};


// register a global helper or global helpers
typo.register = function (pattern, parser) {
    Typo._register(Typo.Helpers.prototype, pattern, parser);  
};





