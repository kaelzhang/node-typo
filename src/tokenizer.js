const escape_regex = require('escape-string-regexp')
const split = require('split-string')
const REGEX_ENDS_WITH_SLASH = /\\$/
const REGEX_CODE_SLICE = /^(\s*)([\s\S]+?)(\s*)$/
const REGEX_SPLIT_CR = /\r|\n/g


module.exports = class Tokenizer {
  constructor ({
    open,
    close
  }) {

    this._open = open.trim()
    this._close = close.trim()
    this._regex = null
  }

  _reset () {
    this._line = 1
    this._column = 1
    this._parsed = []
  }

  get regex () {
    if (this._regex) {
      return this._regex
    }

    return this._regex = new RegExp(
      `${escape_regex(this._open)}(.+?)${escape_regex(this._close)}`, 'g')
  }

  parse (template) {
    this._reset()

    // if template is an emptry string, skip parsing
    if (template === '') {
      return [{
        type: 'String',
        value: template
      }]
    }


    this._parse(template)
    return this._parsed
  }

  // parse a template into a typo object
  // 'a{{a\\ b c d}} {'
  _parse (template) {
    const parsed = []
    const regex = this.regex

    let reader
    let matched
    let slice
    let pos = 0

    while ((reader = regex.exec(template)) !== null) {
      matched = reader[0]
      slice = reader[1]

      // // We met a carrige return
      // if (!slice) {
      //   this._increase_line(1)
      //   continue
      // }

      // normal string
      if (reader.index > pos && reader.index > 0) {
        this._digest_normal_string(template.substring(pos, reader.index))
      }

      pos = reader.index + matched.length
      this._digest_directive(slice)
    }

    if (pos < template.length) {
      this._digest_normal_string(template.substring(pos))
    }
  }

  _digest_normal_string (string) {
    this._parsed.push({
      type: 'String',
      value: string,
      loc: this._loc()
    })

    this._digest_cr(string)
  }

  _increase_line (n = 1) {
    this._line += n
    this._column = 1
  }

  _increase_column (n = 1) {
    this._column += n
  }

  // simple value
  // 'abc'            -> { helper: [], param: 'abc' }

  // one helper, one parameter
  // 'a   abc'        -> { helper: ['a'], param: 'abc' }

  // piped helpers
  // 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
  // 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
  _digest_directive (slice) {
    // {{
    this._digest_open()

    const [
      ,
      prefix_cr,
      content,
      suffix_cr

    ] = slice.match(REGEX_CODE_SLICE)

    // The potential whitespace or carriage return
    this._digest_cr(prefix_cr)

    const [
      helper,
      replacer
    ] = this._split_directive(slice, ' ')

    helper
      // {{blue moon}}
      ? this._digest_helper_replacer(helper, replacer)
      // {{name}}
      : this._digest_replacer(replacer)

    this._digest_cr(suffix_cr)

    // }}
    this._digest_close()
  }

  _digest_open () {
    this._increase_column(this._open.length)
  }

  _digest_close () {
    this._increase_column(this._close.length)
  }

  // Handle cursor
  _digest_cr (slice) {
    const {
      count,
      last
    } = this._count_cr(slice)

    if (count) {
      this._increase_line(count)
    }

    this._increase_column(last.length)
  }

  _digest_replacer (replacer) {
    this._parsed.push({
      type: 'Replacer',
      value: replacer,
      loc: this._loc()
    })

    this._digest_cr(replacer)
  }

  _digest_helper_replacer (helper, replacer) {
    const helper_nodes = []
    const node = {
      type: 'Directive',
      helpers: helper_nodes,
      replacer: null
    }

    const helpers = split(helper, '|')
    const helpers_length = helpers.length

    helpers.forEach((helper, i) => {
      this._digest_helper(helper, helper_nodes)

      if (i < helpers_length - 1) {
        this._increase_column(1)
      }
    })

    // The space
    this._increase_column(1)

    node.replacer = {
      type: 'Replacer',
      value: replacer,
      loc: this._loc()
    }

    this._digest_cr(replacer)

    this._parsed.push(node)
  }

  _digest_helper (helper, nodes) {
    const [
      name,
      params

    ] = split(helper, ':')

    nodes.push({
      type: 'Helper',
      name,
      params,
      loc: this._loc()
    })

    this._digest_cr(helper)
  }

  _loc () {
    return {
      line: this._line,
      col: this._column
    }
  }

  // split a template into two parts by the specified `splitter` and will ignore `'\\' + splitter`
  // @param {string} template
  // @param {string} splitter
  // @returns {Array} array with 2 items
  _split_directive (template, splitter) {
    const splitted = split(template, splitter)

    return splitted.length > 1
      ? [
        splitted.shift(),
        splitted.join(splitter)
      ]

      : [
        '',
        template
      ]
  }

  _count_cr (str) {
    const splitted = str.split(REGEX_SPLIT_CR)
    return {
      count: splitted.length - 1,
      last: splitted.pop()
    }
  }
}
