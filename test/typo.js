'use strict';

var typo = require('typo');

var a = 'abc{{blue b l u e}} eee{{bold a}} {{0}}abc{{red red}}';

typo.log(a, {a: 'bold'}, function(err, value) {
    console.log(err, value);
});