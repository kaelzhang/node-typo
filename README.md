# Typo

> Make typography beautiful in command-line.

Typo is a scalable node.js template engine designed for and focused on command-line (cli), which helps to format and beautify your console output.

Typo supports not only basic [ANSI escope codes](http://en.wikipedia.org/wiki/ANSI_escape_code), such as basic background and foreground colors, underline, bold, etc, and **ALSO** full 8-bit colors (256 colors).

![screenshot](https://raw.github.com/kaelzhang/typo/master/screenshot.png)

## Installation

```bash
npm install typo --save
```
    
## Getting started

Typo is a [`Readable stream`](http://nodejs.org/api/stream.html#stream_class_stream_readable), which means you can `.pipe()` and `.on('data', c)` with it.

```js
// create a typo instance
var typo = require('typo')();

// remember to pipe
typo.pipe(process.stdout); // or, `var typo = require('typo')({output: process.stdout})`

typo.log("There's once in a {{blue blue}} moon~");
```

## Typo Plugins

- [typo-rgb](https://github.com/kaelzhang/typo-rgb): support full 8-bit RGB colors !
- [typo-image](https://github.com/kaelzhang/typo-image): display pictures in CLI !
- [typo-ascii](https://github.com/kaelzhang/typo-ascii): ascii art text in CLI with all kinds of styles ! (on developing)

****

## Usage

### Syntax

	( '{{<helper[:<data>][|helper[:<data>]]> <text>}}', <object> );

#### Simple substitution

```js
typo.log('{{1}}{{b}}{{c.a}}{{c.b}}', {'1': 1, b:2, c: {a: 3}}); 
// print '123c.b'.
// in which, `'c.b'` is not matched in `values` and not substituted.
```
    
#### With helper functions

```js
typo.log('{{bold abc}}');         // print a bold 'abc'
typo.log('{{red abc}}');  		   // print a red 'abc'
```
    
#### With piped helpers

```js
typo.log('{{bold|blue|underline abc}}'); // print a blue bold 'abc' with a underline
````
    
#### Custom helpers

```js
typo.register('sum', function(value){{
    return value.split(',').reduce(function(prev, current){
        return (parseInt(current) || 0) + prev;
    }, 0);
}});

typo.log('{{sum 1,2,3}}');         // print 6
```

#### Working with plugins

You need to install plugins first.
```sh
npm install typo-image
```

```js
var image = require('typo-image');
typo.plugin(image);

typo.log('{{~image ./logo.png}}');  // will print the png image to the CLI !
```
    
#### Nested helpers

```js
typo.log('{#list}3{/list}');
```

Which will not show up before `typo@1.0.0`.

if you like `typo`, there will be a billion thanks if you fork `typo` and make pull requests.

## Available helpers
The helpers below are built-in helpers of typo, and you could define your own helpers by `typo.register` method.

You can also use `typo.plugin` method to register helpers of typo plugins.

### Basic colors

Eight basic ANSI colors:

0     |  1  |   2   |    3   |  4   |    5    |  6   |   7
----- | --- | ----- | ------ | ---- | ------- | ---- | -----
black | red | green | yellow | blue | magenta | cyan | white

	typo.log('{{magenta purple text}}');
	
### Other text styles

- italic # not widely supported. Sometimes treated as inverse.
- bold
- underline
- inverse
- strikethrough

### Plugin: {{rgb:\<rgb\> \<text\>}}

> You need to install plugin 'typo-rgb' to use this helper.

```sh
npm install typo-rgb --save
```

Highlight your text `text` with any RGB colors filled in foreground. 

Notice that if your RGB color is not a standard 8-bit RGB color, typo will **automatically choose the closest** one in the color palette, which will be really helpful.
	
```js
typo.plugin(require('typo-rgb'));
typo.log('{{bg.rgb:#f26d7d|rgb:#000|bold peach bg and black bold font}}');
```
	
There's a background version of RGB: `{{bg.rgb:<rgb> <text>}}`.


## Typo factory and typo constructor

How to create a typo instance.

```js
var Typo = require('typo');
var typo = Typo(options);
```

Or

```js
// this is the typo constructor from which your module could be inherited.
var Typo = require('typo').Typo; 
var typo = new Typo(options);
```

##### options.colors `Boolean`

Optional, default to `true`

If false, typo will clean all styles (colors, bold, etc) and output the pure text, which is really helpfull if you use typo in CI.

##### options.output `Stream.Writeable`

Optional, no default value

The writeable stream to write into. If set, typo will `.pipe()` output to that stream.

However, you could also use `.pipe()` method to do this.

##### options.EOS `String`

Optional, default to `'\n'`

The End-of-Sentence. By default, it's a carriage return.


## Instance Methods

These methods below is the methods of the typo instance.

### typo.log(pattern [,values [,callback]])
Print a formated output to the command-line. Has no return value.

##### pattern `string`

Template pattern

##### values `Object|Array`

Optional

If no `values` passed or not matched, the relevant pattern will not be substituted.

##### callback `function(err, output)`

Optional

Typo also support asynchronous help functions. See "register asynchronous helpers" section.


### typo.template(pattern [,values [,callback]])

##### Returns 

The parsed or substituted ouput, if all helpers are synchronous.

Or output will be passed to `callback`. 

### typo.register(name, helper)
### typo.register(helpers_map)

Register helpers for the current instance

##### name
`string`

##### helper (sync)
`function(str)`

Will be treated as a sync helper, if has **only one** [term parameter](http://en.wikipedia.org/wiki/Parameter_(computer_programming) (also called formal parameter);

Besides, the `data` (in "syntax" section) could be fetched using `this.data` inside `helper`.

##### helper (async)
`function(str, callback)`

If helper has more than one term parameters, it will be treated as an async helper.

And the second parameter will be the callback which should be implemented inside the helper function.

##### helpers_map

`Object`

### typo.plugin(plugin)

Register a plugin

##### plugin `Object`

The typo plugin.

## Register global helpers and plugins

```js
var Typo = require('typo');

Typo.register(helpers); // the same parameters as `typo.register`
Typo.plugin(plugin);	 // the same parameters as `typo.plugin`
```
