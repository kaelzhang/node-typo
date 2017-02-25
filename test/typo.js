const test = require('ava')
const typo = require('..')
const chalk = require('chalk')


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


test.cb('async', t => {
  const result = typo()
  .use('foo', async v => v + ' baz')
  .compile(`{{foo bar}}`)()
  .then((value) => {
    t.is(value, 'bar baz')
    t.end()
  })
})
