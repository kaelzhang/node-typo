// use `'{{'` instead of `'{'` by default,
// because javascript is bad at doing backward look back with regular expression.
// case:
//   {a b\\{c\\}}
const OPEN = '{{'
const CLOSE = '}}'

const Parser = require('./parser')


class Typo {
  constructor ({
    open = OPEN,
    close = CLOSE,
    helpers
  } = {}) {

    this._helpers = {}
    this._parser = new Parser({open, close})

    if (helpers) {

    }
  }

  parse (template) {
    const
  }

  template (template, data) {

  }

  _use (name, helper) {
    this._helpers[name] = helper
  }

  use (name, helpers) {
    if (Object(name) === name) {
      Object.keys(name).forEach((n) => {
        this._use(n, name[n])
      })
      return this
    }

    this._use(name, helper)
    return this
  }

  _substitute
}


// @param {Object} options
// - output: {Stream.Writeable}
// - clean: {boolean} if true, typo will not output SGR charactors
function Typo(options) {
  options = options || {};

  this.colors = 'colors' in options ? options.colors : true;
  this.EOS = options.EOS || '\n';

  var output = options.output;
  output && this.pipe(output);

  this._helpers = new Typo.Helpers();
};


Typo.prototype.write = function(value) {

  // prevent error of `process.stdout`
  this.emit('data', String(value));
};


Typo.prototype.log = function(template, params, callback) {
  var self = this;

  this.template(template, params, function(err, value) {
    if (err) {
      return callback && callback(err);
    }

    self.write(value + self.EOS);

    callback && callback(null, value);
  });
};


Typo.prototype.template = function(template, params, callback) {
  if (arguments.length === 2 && typeof params === 'function') {
    callback = params;
    params = {};
  }

  var self = this;

  var value = substitute(template, params, this._helpers, function(err, value) {
    if (callback) {
      if (err) {
        return callback(err);
      }

      callback(null, self._clean(value));
    }
  });

  return this._clean(value);
};


// Register a helper function or register several helpers
// @param {string} pattern
// @param {function(value[, callback])} parser
//    - value: {mixed}
//  - callback: {function(err, value)} if there's `callback` arguemtn in parser, `parser` will be considered as an asynchronous method
//        - err: {Object} error object
//        - value: {mixed} parsed value
Typo.prototype.register = function(pattern, parser) {

  // allow override for instances
  Typo._register(this._helpers, true, pattern, parser);
};


// Register a typo plugin
Typo.prototype.plugin = function(plugin) {
  this.register(plugin.helpers);
};


// @param {Object} host the host object to register helper functions to
// @param {boolean} override whether override existing helpers
Typo._register = function(host, override, pattern, parser) {
  if (Object(pattern) === pattern) {
    var patterns = pattern;

    for (pattern in patterns) {
      parser = patterns[pattern];
      Typo._register(host, override, pattern, parser);
    }

  } else if (typeof pattern === 'string' && typeof parser === 'function') {
    if (override || !(pattern in host)) {
      host[pattern] = parser;
    }
  }
};



// var REGEX_SUFFIX = /\x1B\[\d+m$/i;

// foreground   : '\x1b[38;5;<cgr>m';
// background   : '\x1b[48;5;<cgr>m';
// normal cgr   : '\x1b[<cgr>m'
// suffix       : '\x1b[\d+m'
var REGEX_CGR = /\x1B\[(?:\d+;)*\d+m/ig;

Typo.prototype._clean = function(subject) {
  return !this.colors ? subject && subject.replace(REGEX_CGR, '') : subject;
};


function Helpers() {};

// register ansi helpers
mix(Helpers.prototype, require('./helper/cgr'));

Typo.Helpers = Helpers;