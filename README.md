# Typo

> Make typography beautiful in command-line.

Typo is a scalable template engine designed for and focused on command-line (cli), which help to format and beautify your console output.

Typo not only supports basic [ANSI escope codes](http://en.wikipedia.org/wiki/ANSI_escape_code), such as basic background and foreground colors, underline, bold, etc, and **ALSO** full 8-bit colors (256 colors).

    
## Getting started

    var typo = require('typo');
    
    typo.log("There's once in a {{blue blue}} moon~");
    
## Syntax

	( '{{<helper[|helper]> <text>[:<data>]}}', <object> );

## Usage

#### Simple substitution
    
    typo.log('{{1}}{{b}}{{c.a}}{{c.b}}', {'1': 1, b:2, c: {a: 3}}); // print '123c.b'
    
#### With helper functions

    typo.log('{{bold abc}}');         // print a bold 'abc'
    typo.log('{{rgb abc:#00ffcc}}');
    
#### With piped helpers

    typo.log('{{bold|blue abc}}');    // print a blue bold 'abc'
    
#### Custom helpers

    typo.register('sum', function(value){{
        return value.split(',').reduce(function(prev, current){
            return (parseInt(current) || 0) + prev;
        }, 0);
    }});
    
    typo.log('{{sum 1,2,3}}');         // print 6
    
#### Nested helpers

    typo.log('{#list}3{/list}');

Which will not show up before `typo@0.2.0`.

if you like `typo`, there will be a billion thanks if you fork `typo` and make pull request.


## Methods

### typo.log(pattern [,values [,callback]])
Print a formated output to the command-line. Has no return value.

##### pattern
`string`

Template pattern

##### values

`Object|Array`, optional

If no `values` passed or not matched, the relevant pattern will not be substituted.

##### callback

`function(err, output)`, optional

Typo also support asynchronous help functions. See "register asynchronous helpers" section.


### typo.template(pattern [,values [,callback]])

Returns the parsed or substituted ouput, if all helpers are synchronous.

Or output will be passed to `callback`. 

### typo.register(name, helper)
### typo.register(helpers_map)
Register helpers

##### name
`string`

##### helper (sync)
`function(str)`

Will be treated as a sync helper, if has **only one** [term parameter](http://en.wikipedia.org/wiki/Parameter_(computer_programming) (also called formal parameter);

Besides, the `data` (in "syntax" section) could be fetched using `this.data` inside `helper`.

##### helper (async)
`function(str, callback)`

If helper has more than one term parameters, it will be treated as an async helper.

And the second parameter will the callback which should be implemented inside the helper function.

****

## Advanced Sections

### Register asynchronous helpers

### Change '{{'

### Using help categories