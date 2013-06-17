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

    async.series(
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
            return s;
        })
    ){
        return substituted.join('');
    }
};


// no fault tolarance and argument overloading
// run a single task
// @param {Object} task returnValue of parser.single

// { helper: [], param: 'abc' }
runtime.tasks = function(task, params, callback) {
    var series;

    var init_value = Array.isArray(task.param) ? 
            task.param.map(function(key) {
                return assign(key, params)
            }) :

            assign(task.param, params);

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
    var helper_function = helper ? assign(helper, helpers, null, true) : helpers.DEFAULT;

    if(!helper_function){
        return callback({code: 404});
    }

    if(helper_function.length === 1){
        callback(null, helper_function(param));

    }else{
        helper_function(param, callback);
    }
};


// TODO: support multiple lines
runtime.log = function(template, params, callback) {
    runtime.template(template, params, function(err, value) {
        if(err){
            return callback && callback(err);
        }

        // formated output
        console.log(value);

        callback && callback(null, value);
    });
};

