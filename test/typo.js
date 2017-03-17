const test = require('ava')
const typo = require('..')
const chalk = require('chalk')
const debug = require('debug')('typo')

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

  // Only test for sync directive
  !c.async
  && test(`sync: ${c.d}`, t => {
    const o = Object.assign({}, c.o || {}, {async: false})
    const compiled = tp.template(c.t, o)

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

  test(`async: ${c.d}`, t => {
    const o = Object.assign({}, c.o || {})
    const compiled = tp.template(c.t, o)

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


;[
{
  d: 'value_not_defined: default print',
  t: '{{blue}}'
  value: 'blue'
}

].forEach(run)

test(, t => {
  return typo()
  .template('{{blue}}', {})
  .then((value) => {
    t.is(value, 'blue')
  })
})


test('value_not_defined: print', t => {
  return typo()
  .compile('{{blue}}', {
    value_not_defined: 'print'
  })()
  .then((value) => {
    t.is(value, 'blue')
  })
})


test('value_not_defined: ignore', t => {
  return typo()
  .compile('{{blue}}', {
    value_not_defined: 'ignore'
  })()
  .then((value) => {
    t.is(value, '')
  })
})


test('value_not_defined: throw', t => {
  return typo()
  .compile(`Once in a {{blue}} moon.

Hahaha`, {
    value_not_defined: 'throw'
  })()
  .then(
    () => {
      t.fail('should throw')
    },
    log
  )
})


test('default directive_value_not_defined', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`)()
  .then((value) => {
    t.is(value, 'blue')
  })
})


test('default directive_value_not_defined: print', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`, {
    value_not_defined: 'print'
  })()
  .then((value) => {
    t.is(value, 'blue')
  })
})

test('default directive_value_not_defined: throw', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`, {
    value_not_defined: 'throw'
  })()
  .then(
    () => {
      t.fail('should throw')
    },
    log
  )
})

test('default directive_value_not_defined: throw, not throw if found', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`, {
    value_not_defined: 'throw'
  })({
    blue: 'blue'
  })
  .then((value) => {
    t.is(value, 'blue')
  })
})

test('default directive_value_not_defined: ignore', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`, {
    value_not_defined: 'ignore'
  })()
  .then((value) => {
    t.is(value, '')
  })
})

test.only('directive_value_not_defined: ignore', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile('{{= blue}}', {
    directive_value_not_defined: 'ignore'
  })()
  .then((value) => {
    t.is(value, '')
  })
})

test('directive_value_not_defined: throw', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`, {
    directive_value_not_defined: 'throw'
  })()
  .then(
    () => {
      t.fail('should throw')
    },
    log
  )
})

test('directive_value_not_defined: throw, not throw if found', t => {
  return typo()
  .use('=', (v) => {
    return v
  })
  .compile(`{{= blue}}`, {
    directive_value_not_defined: 'throw'
  })({
    blue: 'blue'
  })
  .then((value) => {
    t.is(value, 'blue')
  })
})
