module.exports = {
  get_helper,
  get_value
}


const access = require('object-access')
const frame = require('babel-code-frame')
const NOT_FOUND = {}

function get (name, object, template, loc, message) {
  name = name.trim()
  const value = access(object, name, NOT_FOUND)

  if (value !== NOT_FOUND) {
    return value
  }

  throw new Error(`${create_frame(template, loc)}

${message}`)
}


function get_helper (name, helpers, template, loc) {
  return get(name, helpers, template, loc, `Helper "${name}" not found`)
}


function get_value (name, data, template, loc) {
  return get(name, data, template, loc, `Value not found for key "${name}"`)
}


function create_frame (template, loc) {
  return frame(template, loc.line, loc.col)
}