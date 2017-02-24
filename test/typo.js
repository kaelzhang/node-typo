const test = require('ava')
const typo = require('..')
const chalk = require('chalk')


test('basic', t => {
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
  console.log('compiled', compiled())
})
