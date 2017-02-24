'use strict';

module.exports = {
  run: run,
  run_async: run_async
};

var Parser = require('./parser');
var util = require('util');
var map = require('p-map');
var waterfall = require('p-waterfall');
var access = require('object-access');
var DEFAULT_VALUE = {};

function run(_ref) {
  var tokens = _ref.tokens,
      data = _ref.data,
      helpers = _ref.helpers;


  return tokens.map(function (token) {
    if (Object(token) !== token) {
      return token;
    }

    return substitute(token, data, helpers);
  }).join('');
}

// No fault tolerance
// - tokens `Array` tokens
// - data `Object` data to substitute into the template
// - helpers `Object.<name,helper>`
// - concurrency `Number=`
function run_async(_ref2) {
  var tokens = _ref2.tokens,
      data = _ref2.data,
      helpers = _ref2.helpers,
      concurrency = _ref2.concurrency;


  var options = {};

  if (typeof concurrency === 'number') {
    options.concurrency = concurrency;
  }

  return map(tokens, async function (token) {
    if (Object(token) !== token) {
      return token;
    }

    return substitute_one_async(token, data, helpers);
  }, options).then(function (slices) {
    return slices.join('');
  });
}

// no fault tolarance and argument overloading
// run a single task
// @param {Object} task returnValue of parser.single

// { helper: [], param: 'abc', data: '' }
function tasks(section, params, helpers) {
  var series;

  var init_value = assign(task.param, params);

  async.waterfall(series = task.helper.map(function (helper, i) {

    // @param {function()} done `done` function of async
    // @param {mixed} prev_value previous value
    return function (prev_value, done) {

      // first run
      if (i === 0) {
        done = prev_value;
        prev_value = init_value;
      }

      if (helper.data) {
        // {{rgb:data abc}}, {data: '#ffddee'}
        // -> {{rgb:#ffddee abc}}
        helper.data = assign(helper.data, params);
      }

      single(helper, helpers, prev_value, function (err, value) {
        if (err) {
          return done(err);
        }

        // pipe the current result to the next helper
        done(null, value);
      });
    };
  }), function (err, value) {
    if (err) {
      if (err.code === 404) {

        // if helper function not found, return original source
        return callback(err, task.source);
      } else {
        return callback(err);
      }
    }

    callback(null, series.length === 0 ? init_value : value);

    // free
    series.length = 0;
  });
}

// 'a.b', {a: {b: 1}} -> 1
// 'a.b', {a: 1}, false -> false
// 'a.b', undefined -> 'a.b'
function assign(param, obj, default_value, maintain) {
  if (arguments.length === 2) {
    default_value = param;
  }

  // 'a.b' -> ['a', 'b']
  var hierarchies = maintain ? [param] : param.split('.');
  var i = 0;
  var len = hierarchies.length;
  var key;
  var value = obj;

  for (; i < len; i++) {
    key = hierarchies[i];

    if (key in value) {
      value = value[key];
    } else {

      // 'a.b', {a: 1} -> 'a.b'
      return default_value;
    }
  }

  // 'a.b', {a: {b: 1}} -> 1
  return value;
}

function single(helper, helpers, param, callback) {
  var name = helper.name;
  var data = helper.data;
  var context = {};

  var helper_function = name ? assign(name, helpers, null, true) :

  // if no name, treat as default helper
  // {{abc}} -> 'abc'
  helpers.DEFAULT;

  if (!helper_function) {
    return callback({
      code: 404
    });
  }

  if (data) {
    context.data = data;
  }

  if (helper_function.length === 1) {
    callback(null, helper_function.call(context, param));
  } else {
    helper_function.call(context, param, callback);
  }
}