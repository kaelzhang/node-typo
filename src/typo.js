// use `'{{'` instead of `'{'` by default,
// because javascript is bad at doing backward look back with regular expression.
// case:
//   {a b\\{c\\}}
const OPEN = '{{'
const CLOSE = '}}'

const Tokenizer = require('./tokenizer')
const {
  run,
  run_async
} = require('./runtime')


class Typo {
  constructor ({
    open = OPEN,
    close = CLOSE,
    // - ignore
    // - throw
    // - print
    value_not_defined = 'ignore',
    concurrency,
    helpers
  } = {}) {

    this._helpers = {}
    this._tokenizer = new Tokenizer({open, close})
    this._concurrency = concurrency

    if (helpers) {
      this.use(helpers)
    }
  }

  compile (template, {
    async = true
  } = {}) {

    const tokens = this._tokenizer.parse(template)
    return (data) => {
      const runner = async
        ? run_async
        : run

      runner({
        tokens,
        data,
        helpers: this._helpers,
        concurrency: this._concurrency
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
