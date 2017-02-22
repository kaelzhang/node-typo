const escape_regex = require('escape-string-regexp')
const REGEX_ENDS_WITH_SLASH = /\\$/


module.exports = class Tokenizer {
  constructor ({
    open,
    close
  }) {

    this._open = open.trim()
    this._close = close.trim()
    this._regex = null
  }

  get regex () {
    if (this._regex) {
      return this._regex
    }

    return this._regex = new RegExp(
      escape_regex(this._open)
      + '(.+?)'
      + escape_regex(this._close), 'g')
  }

  parse (template) {
    const result = this._parse(template)
    return result
  }

  // parse a template into a typo object
  // 'a{{a\\ b c d}} {'
  _parse (template) {
    // if template is an emptry string, skip parsing
    if (template === '') {
      return ['']
    }

    const regex = this.regex
    const ret = []
    let reader
    let matched
    let pattern
    let pos = 0

    while ((reader = regex.exec(template)) !== null) {
      matched = reader[0]
      pattern = reader[1]

      // normal string
      if (reader.index > pos && reader.index > 0) {
        ret.push(template.substring(pos, reader.index))
      }

      ret.push(this._directive(pattern))

      pos = reader.index + matched.length
    }

    if (pos < template.length) {
      ret.push(template.substring(pos))
    }

    return ret
  }


  // simple value
  // 'abc'            -> { helper: [], param: 'abc' }

  // one helper, one parameter
  // 'a   abc'        -> { helper: ['a'], param: 'abc' }

  // piped helpers
  // 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
  // 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
  _directive (template) {

    const splitted = this._smart_split(template, ' ')
    let helper = splitted[0]
    let param = splitted[1]

    if (!param) {
      // 'abc' -> ['abc'] -> { helper: [], param: 'abc' }
      // 'abc d' -> ['abc', 'd'] -> { helper: ['abc'], param: 'd' }
      param = helper
      helper = ''
    }

    // '' -> []
    // 'a|b' -> ['a', 'b']
    helper = helper
      ? helper.split('|') :
      []

    return {

      // 'rgb:#fff' -> { name: 'rgb', data: '#fff'}
      helpers: helper.map(name => {
        if (!name) {
          return {}
        }

        const splitted = this._smart_split(name, ':')
        const ret = {
          name: splitted[0]
        }

        if (splitted[1]) {
          ret.data = splitted[1]
        }

        return ret
      }),

      param,
      source: template
    }
  }

  // split a template into two parts by the specified `splitter` and will ignore `'\\' + splitter`
  // @param {string} template
  // @param {string} splitter
  // @returns {Array} array with 2 items
  _smart_split (template, splitter) {
    const splitted = template.split(splitter)
    let index = -1

    // template = 'a\\ b|d c'
    // splitter = ' '
    // ['a\\', 'b|d', 'c']
    splitted.some((section, i, s) => {
      if (!REGEX_ENDS_WITH_SLASH.test(section)) {
        index = i
        return true
      }
    })

    var slash_splitter = new RegExp('\\\\' + splitter, 'g')

    return [
      // ['a\\', 'b|d']
      splitted.splice(0, index + 1),
      // ['c']
      splitted

    ].map(function(arr) {

      // '\\ ' -> ' '
      return arr.join(splitter).replace(slash_splitter, splitter)
    })
  }
}
