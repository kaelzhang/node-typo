'use strict';

var Typo = require('./lib/typo');

module.exports = typo;


function typo(options){
    return new Typo(options);
};

typo.Typo = Typo;

// register a global helper or global helpers
typo.register = function (pattern, parser) {

    // To override global configurations is forbidden
    Typo._register(Typo.Helpers.prototype, false, pattern, parser);  
};

typo.plugin = function (plugin) {
    typo.register(plugin.helpers);
};

