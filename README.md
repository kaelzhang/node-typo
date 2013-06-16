# Typo

> Make typography beautiful in command-line.

A formated stdout tool and parser which [cortex](https://github.com/kaelzhang/cortex) uses and is tiny, fast, and of high scalability.

## Installation
	npm install typo --save
	
## Getting started

	var typo = require('typo');
	
	typo.log("There's once in a {{blue blue}} moon~");
	
## Usage

### Simple substitution

	typo.log('{{1}}{{2}}{{3}}', ['a', 'b']); // print 'ab3'
	
	typo.log('{{a}}{{b}}{{c.a}}{{c.b}}', {a: 1, b:2, c: {a: 3}}); // print '123c.b'
	
### With helper functions

	typo.log('{{bold abc}}'); 		// print a bold 'abc'
	
### With piped helpers

	typo.log('{{bold|blue abc}}');	// print a blue bold 'abc'
	
### Custom helpers

	typo.register('sum', function(value){{
		return (Array.isArray(value) ? value : [value])
			.reduce(function(prev, current){
				return (parseInt(current) || 0) + prev;
			}, 0);
	}});
	
	typo.log('{{sum 1,2,3}}'); 		// print 6
	
### Nested helpers

	typo.log('{#list}3{/list}');

Which will not show up before `typo@0.2.0`.

if you like `typo`, there will be a billion thanks if you fork `typo` and make pull request.

****

## Advanced Sections

### Register asynchronous helpers

### Change '{{'

### Using help categories