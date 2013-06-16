# Typo
> Make typography beautiful in stdout

A formated stdout tool and parser which [cortex](https://github.com/kaelzhang/cortex) uses.

## Installation
	npm install typo --save
	
## Getting started

	var typo = require('typo');
	
	var pattern = '{{#bold abbr}} stands for {{#red 0}}, {{g}} and {{#blue blue}}';
	var context = [0];
	context.g = 'green';
	context.abbr = '"RGB"';
	
	typo.log(pattern, context);
	
	typo.parse(pattern);
	
## Usage
