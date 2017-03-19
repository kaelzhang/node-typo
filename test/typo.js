const test = require('ava')
const typo = require('..')
const chalk = require('chalk')
const debug = require('debug')('typo')
const delay = require('delay')

function log (e) {
  debug('Error: %s', e.stack || e.message || e)
}


// const CASES = [
//   {
//     template,
//     open,
//     close,
//     async,
//     concurrency,
//     value_not_defined
//   },

// ]

test('basic with chalk', t => {
  const {
    template
  } = require('./fixtures/tokens')

  const p = typo()

  const helpers = {}
  Object.keys(chalk.styles).forEach((name) => {
    helpers[name] = chalk[name]
  })

  p.use(helpers)
  const compiled = p.compile('Once in a {{blue blue}} moon', {
    async: false
  })

  t.is(compiled(), `Once in a ${chalk.blue('blue')} moon`)
})


test('async', t => {
  return typo()
  .use('foo', async v => v + ' baz')
  .compile(`{{foo bar}}`)()
  .then((value) => {
    t.is(value, 'bar baz')
  })
})


function run (c) {
  const tp = typo()
  if (c.u) {
    tp.use(...c.u)
  }

  const _test = c.only
    ? test.only
    : test

  // Only test for sync directive
  !c.async
  && _test(`sync: ${c.d}`, t => {
    const o = Object.assign({}, c.o || {}, {async: false})
    const compiled = tp.compile(c.t, o)

    if (c.throw) {
      try {
        compiled(c.data)
      } catch (e) {
        log(e)
        return
      }

      t.fail('should throw')
      return
    }

    t.is(compiled(c.data), c.value)
  })

  _test(`async: ${c.d}`, t => {
    const o = Object.assign({}, c.o || {})
    const compiled = tp.compile(c.t, o)

    if (c.throw) {
      return compiled(c.data)
      .then(
        () => {
          t.fail('should throw')
        },
        log
      )
    }

    return compiled(c.data)
    .then((value) => {
      t.is(value, c.value)
    })
  })
}


const ARGS_DIRECTIVE_EQUAL = ['=', v => v]
const ARGS_DIRECTIVE_EQUAL_OBJECT = [{
  '=': v => v
}]

;[
{
  d: 'value_not_defined: default print',
  t: '{{blue}}',
  value: 'blue'
},
{
  d: 'value_not_defined: print',
  t: '{{blue}}',
  value: 'blue'
},
{
  d: 'value_not_defined: ignore',
  o: {
    value_not_defined: 'ignore'
  },
  t: '{{blue}}',
  value: ''
},
{
  d: 'value_not_defined: throw',
  o: {
    value_not_defined: 'throw'
  },
  t: `Once in a {{blue}} moon.

// Hahaha`,
  throw: true
},
{
  d: 'default directive_value_not_defined',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  value: 'blue'
},
{
  d: 'default directive_value_not_defined, use object',
  u: ARGS_DIRECTIVE_EQUAL_OBJECT,
  t: '{{= blue}}',
  value: 'blue'
},
{
  d: 'default directive_value_not_defined: print',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    value_not_defined: 'print'
  },
  value: 'blue'
},
{
  d: 'default directive_value_not_defined: throw',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    value_not_defined: 'throw'
  },
  throw: true
},
{
  d: 'default directive_value_not_defined: throw, not throw if found',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    value_not_defined: 'throw'
  },
  data: {
    blue: 'blue'
  },
  value: 'blue'
},
{
  d: 'default directive_value_not_defined: ignore',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    value_not_defined: 'ignore'
  },
  value: ''
},
{
  d: 'directive_value_not_defined: ignore',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    directive_value_not_defined: 'ignore'
  },
  value: ''
},
{
  d: 'directive_value_not_defined: throw',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    directive_value_not_defined: 'throw'
  },
  throw: true
},
{
  d: 'directive_value_not_defined: throw, not throw if found',
  u: ARGS_DIRECTIVE_EQUAL,
  t: '{{= blue}}',
  o: {
    directive_value_not_defined: 'throw'
  },
  data: {
    blue: 'blue'
  },
  value: 'blue'
},
{
  d: 'directive not found',
  t: '{{= blue}}',
  throw: true
},
{
  d: 'async directive',
  t: '{{= color}}',
  u: ['=', v => delay(50).then(() => v)],
  async: true,
  data: {
    color: 'blue'
  },
  value: 'blue'
}

].forEach(run)
