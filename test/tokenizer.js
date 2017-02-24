const test = require('ava')
const Tokenizer = require('../lib/tokenizer')


test('tokenizer', t => {
  const p = new Tokenizer({
    open: '{{',
    close: '}}'
  })

  const {
    template,
    tokens
  } = require('./fixtures/tokens')

  const result = p.parse(template)
  t.deepEqual(result, tokens)
})
