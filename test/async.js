'use strict';

var async = require('async');


async.waterfall([
    function(done){
        done()
    }

], function() {
    console.log(1);
});

console.log(2);