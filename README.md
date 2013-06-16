# Typo
> Make typography beautiful in stdout

A formated stdout tool and parser.

## Installation
	npm install typo --save
	
## Getting started

	var typo = require('typo');
	
	var pattern = '{{#bold "RGB"}} stands for {{#red 0}}, {{#green g}} and {{#blue blue}}';
	var context = [0];
	contex.g = 'green';
	
	typo.log(pattern, context);
	
	typo.parse(pattern);
