'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

module.exports = {
  run: run,
  run_async: run_async
};

var Parser = require('./parser');
var util = require('util');
var map = require('p-map');
var reduce = require('p-reduce');
var DEFAULT_VALUE = {};

var _require = require('./utils'),
    get_helper = _require.get_helper,
    get_value = _require.get_value;

function run(_ref) {
  var tokens = _ref.tokens,
      data = _ref.data,
      helpers = _ref.helpers,
      template = _ref.template,
      value_not_defined = _ref.value_not_defined;


  return tokens.map(function (token) {
    if (token.type === 'String') {
      return token.value;
    }

    if (token.type === 'Replacer') {
      return get_replacer_value(token, data, template, value_not_defined);
    }

    var value = get_replacer_value(token.replacer, data, template, value_not_defined);

    return token.helpers.reduce(function (prev, current) {
      var helper = get_helper(current.name, helpers, template, current.loc);
      return current.param ? helper(prev, current.param) : helper(prev);
    }, value);
  }).join('');
}

// No fault tolerance
// - tokens `Array` tokens
// - data `Object` data to substitute into the template
// - helpers `Object.<name,helper>`
// - concurrency `Number=`
function run_async(_ref2) {
  var _this = this;

  var tokens = _ref2.tokens,
      data = _ref2.data,
      helpers = _ref2.helpers,
      template = _ref2.template,
      concurrency = _ref2.concurrency,
      value_not_defined = _ref2.value_not_defined;


  var options = {};

  if (typeof concurrency === 'number') {
    options.concurrency = concurrency;
  }

  return map(tokens, function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(token) {
      var value;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              if (!(token.type === 'String')) {
                _context2.next = 2;
                break;
              }

              return _context2.abrupt('return', token.value);

            case 2:
              if (!(token.type === 'Replacer')) {
                _context2.next = 4;
                break;
              }

              return _context2.abrupt('return', get_replacer_value(token, data, template, value_not_defined));

            case 4:
              value = get_replacer_value(token.replacer, data, template, value_not_defined);
              return _context2.abrupt('return', reduce(token.helpers, function () {
                var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(prev, current) {
                  var helper;
                  return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          helper = get_helper(current.name, helpers, template, current.loc);
                          return _context.abrupt('return', current.param ? helper(prev, current.param) : helper(prev));

                        case 2:
                        case 'end':
                          return _context.stop();
                      }
                    }
                  }, _callee, _this);
                }));

                return function (_x2, _x3) {
                  return _ref4.apply(this, arguments);
                };
              }(), value));

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }(), options).then(function (slices) {
    return slices.join('');
  });
}

function get_replacer_value(node, data, template, value_not_defined) {
  try {
    return get_value(node.value, data, template, node.loc);
  } catch (e) {
    switch (value_not_defined) {
      case 'ignore':
        return '';
      case 'throw':
        throw e;
      case 'print':
        return node.value;
    }
  }
}