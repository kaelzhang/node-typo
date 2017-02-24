module.exports = {
  run,
  run_async
}

const Parser = require('./parser')
const util = require('util')
const map = require('p-map')
const reduce = require('p-reduce')
const DEFAULT_VALUE = {}
const {
  get_helper,
  get_value
} = require('./utils')


function run ({
  tokens,
  data,
  helpers,
  template,
  value_not_defined
}) {

  return tokens
  .map(token => {
    if (token.type === 'String') {
      return token.value
    }

    if (token.type === 'Replacer') {
      return get_replacer_value(token, data, template, value_not_defined)
    }

    const value = get_replacer_value(token.replacer, data, template, value_not_defined)

    return token.helpers.reduce((prev, current) => {
      const helper = get_helper(current.name, helpers, template, current.loc)
      return current.param
        ? helper(prev, current.param)
        : helper(prev)

    }, value)
  })
  .join('')
}


// No fault tolerance
// - tokens `Array` tokens
// - data `Object` data to substitute into the template
// - helpers `Object.<name,helper>`
// - concurrency `Number=`
function run_async ({
  tokens,
  data,
  helpers,
  template,
  concurrency,
  value_not_defined
}) {

  const options = {}

  if (typeof concurrency === 'number') {
    options.concurrency = concurrency
  }

  return map(tokens, async token => {
    if (token.type === 'String') {
      return token.value
    }

    if (token.type === 'Replacer') {
      return get_replacer_value(token, data, template, value_not_defined)
    }

    const value = get_replacer_value(token.replacer, data, template, value_not_defined)

    return reduce(token.helpers, async (prev, current) => {
      const helper = get_helper(current.name, helpers, template, current.loc)
      return current.param
        ? helper(prev, current.param)
        : helper(prev)

    }, value)

  }, options)
  .then(slices => slices.join(''))
}


function get_replacer_value (node, data, template, value_not_defined) {
  try {
    return get_value(node.value, data, template, node.loc)
  } catch (e) {
    switch (value_not_defined) {
      case 'ignore':
        return ''
      case 'throw':
        throw e
      case 'print':
        return node.value
    }
  }
}
