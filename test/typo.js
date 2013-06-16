'use strict';

var typo = require('typo');

var a = 'abc{{blue|bold blu e}}{{blue blue}} eee{{bold a}} {{0}}abc{{red red}}';

typo.log(a, {a: 'bold'}, function(err, value) {
    console.log(err, value);
});

typo.log('{{a}}{{b}}{{c.a}}{{c.b}}', {a: 1, b:2, c: {a: 3}}, function(err, value) {
    console.log(err, value);
});

typo.log('{{a}}', {a: 1}, function(err, value) {
    console.log(err, value);
});

typo.register('sum', function(value){{
    return (Array.isArray(value) ? value : [value])
        .reduce(function(prev, current){
            return (parseInt(current) || 0) + prev;
        }, 0);
}});

typo.log('{{sum 1,2,3}}');      // print 6