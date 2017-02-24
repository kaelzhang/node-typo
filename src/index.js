module.exports = typo

const {
  Typo,
  OPEN,
  CLOSE
} = require('./typo')

function typo (options) {
  return new Typo(options)
}

typo.Typo = Typo
typo.OPEN = OPEN
typo.CLOSE = CLOSE
