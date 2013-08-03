'use strict';

var typo = require('typo')({
    colors: ! ~ process.argv.indexOf('--clean'),
    output: process.stdout
});

// typo.pipe(process.stdout)

var a = 'abc{{blue|bold blu e}}{{blue blue}} eee{{bold a}} {{0}}abc{{red red}}';

typo.log(a, {a: 'bold'}, function(err, value) {
    console.log('result', err, value);
});

typo.log('{{italic a}}{{b}}{{c.a}}{{c.b}}', {a: 1, b:2, c: {a: 3}}, function(err, value) {
    console.log('result', err, value);
});

typo.log('{{underline a}}', {a: 1}, function(err, value) {
    console.log('result', err, value);
});

typo.register('sum', function(value){{
    return (Array.isArray(value) ? value : [value])
        .reduce(function(prev, current){
            return (parseInt(current) || 0) + prev;
        }, 0);
}});

typo.log('{{sum 1,2,3}}');      // print 6

// typo.log(
// 	'{{rgb:#f26d7d peach font}}' + 
// 	'{{bg.rgb:#f26d7d|rgb:#000 peach bg and black font}}' +
// 	'{{bg.rgb:#f26d7d peach bg and white font}}'
// );

typo.register({
    json: function(value) {
        return JSON.stringify(value);
    }
});

typo.log('json: {{json a}}', {
    a: {
        a: {
            b: 2
        }
    }
});

typo.write(true);