'use strict';

var Typo = require('./lib/typo');

module.exports = typo;


function typo(options){
    return new Typo(options);
};

// typo.util.RGB = require('./util/rgb');

typo.Typo = Typo;


// typo.__proto__ = new Typo;

// Typo.call(typo, {
//     output: process.stdout
// });





