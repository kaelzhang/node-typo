'use strict';

var parser = require('../lib/parser');

var a = 'abc{{a b c d}} eee{{a\\ b|d c, d,e}} {{0}}abc{{abc d}}';

console.log( parser.parse(a) );