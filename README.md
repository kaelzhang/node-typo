[![Build Status](https://travis-ci.org/kaelzhang/node-typo.svg?branch=master)](https://travis-ci.org/kaelzhang/node-typo)
<!-- optional appveyor tst
[![Windows Build Status](https://ci.appveyor.com/api/projects/status/github/kaelzhang/node-typo?branch=master&svg=true)](https://ci.appveyor.com/project/kaelzhang/node-typo)
-->
<!-- optional npm version
[![NPM version](https://badge.fury.io/js/typo.svg)](http://badge.fury.io/js/typo)
-->
<!-- optional npm downloads
[![npm module downloads per month](http://img.shields.io/npm/dm/typo.svg)](https://www.npmjs.org/package/typo)
-->
<!-- optional dependency status
[![Dependency Status](https://david-dm.org/kaelzhang/node-typo.svg)](https://david-dm.org/kaelzhang/node-typo)
-->

# typo

`typo` is an extendable template engine designed for the future:

- featured with `Promise` and `async/await`.
- powerful custom sync/async helpers.

## Install

```sh
$ npm install typo --save
```

## Usage

```js
const typo = require('typo')()
typo.template('Hello, "{{foo}}"', {foo: "bar"}).then(console.log)
// Hello, "bar"
```

### `typo` with chalk

```js
const typo = require('typo')()
const chalk = require('chalk')
typo.use(chalk)

typo.template('Once in a {{blue blue}} moon').then(console.log)
// Then it will print a blue word "blue"
```

### Custom helpers

Basic:

```js
typo.use('upper', word => word.toUpperCase())
typo.template('{{upper foo}} bar').then(console.log)
// FOO bar
```

### Asychronous helpers

```js
```

## Syntax

```
{{<helper-name>[:<helper-params>][|<helper-name&params>] <values>}}
{{<values>}}
```



## License

MIT
