'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var escape_regex = require('escape-string-regexp');

// use `'{{'` instead of `'{'` by default,
// because javascript is bad at doing backward look back with regular expression.
// case:
//   {a b\\{c\\}}
var OPEN = '{{';
var CLOSE = '}}';
var REGEX_ENDS_WITH_SLASH = /\\$/;

module.exports = function () {
  function Parser() {
    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$open = _ref.open,
        open = _ref$open === undefined ? OPEN : _ref$open,
        _ref$close = _ref.close,
        close = _ref$close === undefined ? CLOSE : _ref$close;

    _classCallCheck(this, Parser);

    this._open = open.trim();
    this._close = close.trim();
    this._regex = null;
  }

  _createClass(Parser, [{
    key: 'parse',


    // parse a template into a typo object
    // 'a{{a\\ b c d}} {'
    value: function parse(template) {
      // if template is an emptry string, skip parsing
      if (template === '') {
        return [''];
      }

      var regex = this.regex;
      var ret = [];
      var reader = void 0;
      var matched = void 0;
      var pattern = void 0;
      var pos = 0;

      while ((reader = regex.exec(template)) !== null) {
        matched = reader[0];
        pattern = reader[1];

        // normal string
        if (reader.index > pos && reader.index > 0) {
          ret.push(template.substring(pos, reader.index));
        }

        ret.push(this._directive(pattern));

        pos = reader.index + matched.length;
      }

      if (pos < template.length) {
        ret.push(template.substring(pos));
      }

      return ret;
    }

    // simple value
    // 'abc'            -> { helper: [], param: 'abc' }

    // one helper, one parameter
    // 'a   abc'        -> { helper: ['a'], param: 'abc' }

    // piped helpers
    // 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
    // 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }

  }, {
    key: '_directive',
    value: function _directive(template) {
      var _this = this;

      var splitted = this._smart_split(template, ' ');
      var helper = splitted[0];
      var param = splitted[1];

      if (!param) {
        // 'abc' -> ['abc'] -> { helper: [], param: 'abc' }
        // 'abc d' -> ['abc', 'd'] -> { helper: ['abc'], param: 'd' }
        param = helper;
        helper = '';
      }

      // '' -> []
      // 'a|b' -> ['a', 'b']
      helper = helper ? helper.split('|') : [];

      return {

        // 'rgb:#fff' -> { name: 'rgb', data: '#fff'}
        helpers: helper.map(function (name) {
          if (!name) {
            return {};
          }

          var splitted = _this._smart_split(name, ':');
          var ret = {
            name: splitted[0]
          };

          if (splitted[1]) {
            ret.data = splitted[1];
          }

          return ret;
        }),

        param: param,
        source: template
      };
    }

    // split a template into two parts by the specified `splitter` and will ignore `'\\' + splitter`
    // @param {string} template
    // @param {string} splitter
    // @returns {Array} array with 2 items

  }, {
    key: '_smart_split',
    value: function _smart_split(template, splitter) {
      var splitted = template.split(splitter);
      var index = -1;

      // template = 'a\\ b|d c'
      // splitter = ' '
      // ['a\\', 'b|d', 'c']
      splitted.some(function (section, i, s) {
        if (!REGEX_ENDS_WITH_SLASH.test(section)) {
          index = i;
          return true;
        }
      });

      var slash_splitter = new RegExp('\\\\' + splitter, 'g');

      return [
      // ['a\\', 'b|d']
      splitted.splice(0, index + 1),
      // ['c']
      splitted].map(function (arr) {

        // '\\ ' -> ' '
        return arr.join(splitter).replace(slash_splitter, splitter);
      });
    }
  }, {
    key: 'regex',
    get: function get() {
      if (this._regex) {
        return this._regex;
      }

      return this._regex = new RegExp(escape_regex(this._open) + '(.+?)' + escape_regex(this._close), 'g');
    }
  }]);

  return Parser;
}();