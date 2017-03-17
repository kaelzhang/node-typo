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
- powerful custom sync/async directives(helpers).

## Install

```sh
$ npm install typo --save
```

## Usage

```js
const typo = require('typo')()
typo.template('Hello, {{user.name}}!', {
  user: {
    name: 'Steve'
  }
}).then(console.log)
// Hello, Steve!
```

### `typo` with chalk

```js
const typo = require('typo')()
const chalk = require('typo-chalk')
typo.use(chalk)

typo.template('Once in a {{blue blue}} moon').then(console.log)
// Then it will print a blue word "blue"
```

### Custom directives

Basic:

```js
typo.use('upper', word => word.toUpperCase())
typo.template('{{upper foo}} bar').then(console.log)
// FOO bar
```

### Asychronous directives

```js
typo.use('fullname', async name => await getFullNameFromServer(name))
typo.template('{{fullname name}}', {name: 'Steve'}).then(console.log)
// Steve Jobs

typo.template('{{fullname Steve}}').then(console.log)
// Steve Jobs
```

### Compile the template and use it Later

```js
const template = typo.compile(`Once in a {{blue color}} moon`)

template({color: 'blue'})
.then(console.log)
// Once in a blue moon
```

## typo({open, close})

Creates the `typo` instance.

- **open** `String={{` The beginning of each directive.
- **close** `String=}}` The end of each directive.

## compile(template, compile_options)

Compiles a template into a function.

- **template** `String`
- **compile_options** `Object`
  - async `Boolean=true` whether should be compiled into an asynchronous function, defaults to `true`
  - concurrency `Number=Number.POSITIVE_INFINITY` If compiled as an asynchronous function, the number of max concurrently pending directive functions.
  - value_not_defined `enum.<print|ignore|throw>=print` Suppose the value of an expression is not found in `data`, then it will print the expression directly if `print`(as default), or print nothing if `ignore`, or throw an error if `throw`.
  - directive_value_not_defined `enum.<print|ignore|throw>=value_not_defined` Tells `typo` what to do if the parameter expression of a directive is not found in `data`. And this option is default to the value of `value_not_defined`

```js
// default options
typo.compile('{{blue color}}')()
// prints a blue letter, "color"
.then(console.log) => {

// value_not_defined: throw
typo.compile('{{blue color}}', {
  value_not_defined: 'throw'
})()
.catch((e) => {
  // code frame and
  // 'value not found for key "color"''
  console.error(e.message)
})

typo.compile('{{adjective}} {{blue color}}', {
  value_not_defined: 'throw',
  directive_value_not_defined: 'print'
})({
  adjective: 'beautiful'
})
// prints "beautiful color", and the letter color is blue
.then(console.log)
```

Returns `function(data)`

async: false

```js
const result = typo.compile(template)(data)
console.log(result)
```

async: true (default)

```js
typo.compile(template)(data).then(console.log)
```

## template(template, data, compile_options)

- template `String`
- data `Object=`
- compile_options `Object=`

Returns `Promise` if `compile_options.async` is `true`(default), or `String` the substituted result if is not.

## Syntax

```mustache
{{<directive>[:<directive-params>][|<directive&params>] <expression>}}
{{<expression>}}
```


## License

MIT
