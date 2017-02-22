const test = require('ava')
const Parser = require('../lib/parser')

test('abc', t => {
  const p = new Parser()

  const result = p.parse(`abc
    aaa{{blue blue}}bbb
    ccc{{blue blue blue}}ddd
    eee{{blue|blue blue}}fff
    ggg{{blue:blue blue}}hhh
    ggg{{blue:blue,blue blue}}hhh
    iii{{blue\\ blue blue}}jjj
    kkk{{blue:blue\\:blue blue}}lll
    kkk{{blue:blue\\:blue,blue blue}}lll
`)

  console.log(JSON.stringify(result, null, 2))

  t.is(true, true)
})
