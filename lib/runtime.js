'use strict';

var async = require('./async');
var parser = require('./parser');
var helpers = require('./helper').helpers;

var runtime = module.exports = {};


// @public
runtime.template = function(template, params, callback) {
    params = params || {};

    var parsed = Array.isArray(template) ? template : parser.parse(template);
    var series;
    var substituted = [];

    async.parallel(
        series = parsed.map(function(section, i) {
            return function(done) {
                if(Object(section) === section){
                    runtime.tasks(section, params, function(err, value) {
                        if(err){
                            return done(err);
                        }

                        substituted[i] = value;
                        done();
                    });

                }else{
                    substituted[i] = section;
                    done();
                }
            }
        }),

        function(err) {
            if(err){
                return callback && callback(err)
            }

            series.length = 0;

            callback && callback(null, substituted.join(''));
        }
    );

    // if the task is synchronous, return value
    if(
        substituted.length === parsed.length && 
        substituted.every(function(s) {

            // s might be negative values, such as '', 0
            return s !== undefined;
        })
    ){
        return substituted.join('');
    }
};


// no fault tolarance and argument overloading
// run a single task
// @param {Object} task returnValue of parser.single

// { helper: [], param: 'abc', data: '' }
runtime.tasks = function(task, params, callback) {
    var series;

    var init_value = assign(task.param, params);

    async.waterfall(
        series = task.helper.map(function(helper, i) {

            // @param {function()} done `done` function of async
            // @param {mixed} prev_value previous value
            return function(prev_value, done) {

                // first run
                if(i === 0){
                    done = prev_value;
                    prev_value = init_value;
                }

                if(helper.data){
                    // {{rgb:data abc}}, {data: '#ffddee'}
                    // -> {{rgb:#ffddee abc}}
                    helper.data = assign(helper.data, params);
                }

                runtime.single(helper, prev_value, function(err, value) {
                    if(err){
                        return done(err);
                    }

                    // pipe the current result to the next helper
                    done(null, value);
                })
            }
        }),

        function(err, value) {
            if(err){
                if(err.code === 404){

                    // if helper function not found, return original source
                    return callback(err, task.source);
                }else{
                    return callback(err);
                }
            }

            callback(null, series.length === 0 ? init_value : value);

            // free
            series.length = 0;
        }
    )
};


// 'a.b', {a: {b: 1}} -> 1
// 'a.b', {a: 1}, false -> false
// 'a.b', undefined -> 'a.b'
function assign(param, obj, default_value, maintain){
    if(arguments.length === 2){
        default_value = param;
    }

    // 'a.b' -> ['a', 'b'];
    var hierarchies = maintain ? [param] : param.split('.');
    var i = 0;
    var len = hierarchies.length;
    var key;
    var value = obj;

    for(; i < len; i ++){
        key = hierarchies[i];

        if( key in value ){
            value = value[key];
        }else{

            // 'a.b', {a: 1} -> 'a.b'
            return default_value;
        }
    }

    // 'a.b', {a: {b: 1}} -> 1
    return value;
}


runtime.single = function(helper, param, callback) {
    var name = helper.name;
    var data = helper.data;
    var context = {};

    var helper_function = name ? 
        assign(name, helpers, null, true) :

        // if no name, treat as default helper
        // {{abc}} -> 'abc'
        helpers.DEFAULT;

    if(!helper_function){
        return callback({code: 404});
    }

    if(data){
        context.data = data;
    }

    if(helper_function.length === 1){
        callback(null, helper_function.call(context, param));

    }else{
        helper_function.call(context, param, callback);
    }
};


// TODO: support multiple lines
runtime.log = function(template, params, callback) {
    if(arguments.length === 2 && typeof params === 'function'){
        callback = params;
        params = {};
    }

    runtime.template(template, params, function(err, value) {
        if(err){
            return callback && callback(err);
        }

        // formated output
        process.stdout.write(value + '\n');

        callback && callback(null, value);
    });
};

