'use strict';


var parser = module.exports = {

    // use `'{{'` instead of `'{'` by default,
    // because javascript is bad at doing backward look back with regular expression.
    // case:
    //       {a b\\{c\\}}
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


// Main entrance
// parse a template into a typo object
// 'a{{a\\ b c d}} {'
parser.parse = function(template) {
    // if template is an emptry string, skip parsing
    if(template === ''){
        return [''];
    }

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
        
        ret.push( single(pattern) );
        
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
// 'a   abc'        -> { helper: ['a'], param: 'abc' }

// piped helpers
// 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
// 'a|b abc'        -> { helper: ['a', 'b'], param: 'abc' }
function single (template) {

    var splitted = smart_split(template, ' ');
    var helper = splitted[0];
    var param = splitted[1];

    if(!param){
        // 'abc' -> ['abc'] -> { helper: [], param: 'abc' }
        // 'abc d' -> ['abc', 'd'] -> { helper: ['abc'], param: 'd' }
        param = helper;
        helper = '';
    }

    // '' -> []
    // 'a|b' -> ['a', 'b']
    helper = helper ? helper.split('|') : [];

    return {

        // 'rgb:#fff' -> { name: 'rgb', data: '#fff'}
        helper: helper.map(function(name) {
            if(name){
                var splitted = smart_split(name, ':');
                var ret = {
                    name: splitted[0]
                };

                if(splitted[1]){
                    ret.data = splitted[1]
                }

                return ret;
            }else{
                return {}
            }
        }),

        param: param,
        source: template
    };
};


var REGEX_ENDS_WITH_SLASH = /\\$/;

// split a template into two parts by the specified `splitter` and will ignore `'\\' + splitter`
// @param {string} template
// @param {string} splitter
// @returns {Array} array with 2 items
function smart_split (template, splitter) {
    var splitted = template.split(splitter);
    var index = -1;

    // template = 'a\\ b|d c'
    // splitter = ' '
    // ['a\\', 'b|d', 'c']
    splitted.some(function(section, i, s) {
       if(!REGEX_ENDS_WITH_SLASH.test(section) ){
           index = i;
           return true;
       }
    });

    var slash_splitter = new RegExp('\\\\' + splitter, 'g');

    return [
        // ['a\\', 'b|d']
        splitted.splice(0, index + 1),
        // ['c']
        splitted
    ].map(function(arr) {

        // '\\ ' -> ' '
        return arr.join(splitter).replace(slash_splitter, splitter);
    });
};


