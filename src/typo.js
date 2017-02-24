// use `'{{'` instead of `'{'` by default,
// because javascript is bad at doing backward look back with regular expression.
// case:
//   {a b\\{c\\}}
const OPEN = '{{'
const CLOSE = '}}'

const Tokenizer = require('./tokenizer')
const { EventEmitter } = require('events')
const {
  run,
  run_async
} = require('./runtime')


class Typo extends EventEmitter {
  constructor ({
    open = OPEN,
    close = CLOSE,
    helpers
  } = {}) {

    super()

    this._helpers = {}
    this._tokenizer = new Tokenizer({open, close})

    if (helpers) {
      this.use(helpers)
    }
  }

  compile (template, {
    async = true,
    concurrency,
    // - ignore
    // - throw
    // - print
    value_not_defined = 'print'
  } = {}) {

    const tokens = this._tokenizer.parse(template)
    return (data = {}) => {
      const runner = async
        ? run_async
        : run

      return runner({
        tokens,
        data,
        helpers: this._helpers,
        value_not_defined,
        template,
        concurrency
      })
    }
  }

  template (template, data, options) {
    return this.compile(template, options)(data)
  }

  _use (name, helper) {
    // TODO: assertion
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
}


module.exports = {
  OPEN,
  CLOSE,
  Typo
}
