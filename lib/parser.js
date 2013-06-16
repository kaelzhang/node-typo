'use strict';


var parser = module.exports = {

	// use `'{{'` instead of `'{'` by default,
	// because javascript is bad at doing backward look back with regular expression.
	// case:
	// 	  {a b\\{c\\}}
    PREFIX_SYMBOL: '{{',
    SUFFIX_SYMBOL: '}}',
    CACHE_SPLITTER: '`',

    get regex(){
    	var seed = parser.PREFIX_SYMBOL + parser.CACHE_SPLITTER + parser.SUFFIX_SYMBOL;

    	return regex_cache[seed] || (

    		// lazy match
    		regex_cache[seed] = new RegExp(parser.PREFIX_SYMBOL + '(.+?)' + parser.SUFFIX_SYMBOL, 'g')
    	);
    }
};

var regex_cache = {};


var REGEX_ENDS_WITH_SLASH = /\\$/;


// 'a{{a\\ b c d}} {'
parser.parse = function(template) {
	var regex = parser.regex;
	var ret = [];
	var reader;
	var matched;
	var pattern;
	var pos = 0;

	while((reader = regex.exec(template)) !== null){
		matched = reader[0];
		pattern = reader[1];
		
		// normal string
		if(reader.index > pos && reader.index > 0){
			ret.push( template.substring(pos, reader.index) );
		}
		
		ret.push( parser.single(pattern) );
		
		pos = reader.index + matched.length;
	}
	
	if(pos < template.length){
		ret.push( template.substring(pos) );
	}

	return ret;
};


// simple value
// 'abc'            -> { helper: [], param: 'abc' }

// one helper, one parameter
// 'a   abc'     	-> { helper: ['a'], param: 'abc' }

// one helper, more than one parameters 
// 'a abc,def' 		-> { helper: ['a'], param: ['abc', 'def'] }
// 'a abc, def'		-> { helper: ['a'], param: ['abc', ' def'] } // whitespaces will not be ignored

// piped helpers
// 'a|b abc'      	-> { helper: ['a', 'b'], param: 'abc' }
// 'a|b abc'     	-> { helper: ['a', 'b'], param: 'abc' }
parser.single = function(template) {
	var WHITE = ' ';
    var splitted = template.split(WHITE);
    var index = -1;

    // 'a\\ b|d c'
    // ['a\\', 'b|d', 'c']
    splitted.some(function(section, i, s) {
   		if(
   			!REGEX_ENDS_WITH_SLASH.test(section) && 

   			(
   				// 'abc' -> ['abc'] -> { helper: [], param: 'abc' }
   				i !== 0 || 
   				// 'abc d' -> ['abc', 'd'] -> { helper: ['abc'], param: 'd' }
   				s.length > 1
   			)
   		){
   			index = i;
   			return true;
   		}
    });

    // 'a b|d'
    var helper = splitted.splice(0, index + 1).join(WHITE).replace(/\\ /g, WHITE);
    // 'c'
    var param = splitted.join(WHITE).replace(/\\ /g, WHITE).trimLeft().split(',');

    // '' -> []
    // 'a|b' -> ['a', 'b']
    helper = helper ? helper.split('|') : [];
    param = param.length > 1 ? param : param[0]; 

    return {
    	helper: helper,
    	param: param
    };
};

