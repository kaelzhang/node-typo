const test = require('ava')
const Tokenizer = require('../lib/tokenizer')

test('abc', t => {
  const p = new Tokenizer({
    open: '{{',
    close: '}}'
  })

  const result = p.parse(`abc
    aaa{{blue blue}}bbb
    ccc{{blue blue blue}}ddd
`)

  console.log(JSON.stringify(result, null, 2))

  t.is(true, true)
})
