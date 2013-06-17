'use strict';

var RGB = require('../util/rgb');


var REGEX_IS_SHORT_RGB = /^[a-z0-9]{3}$/;
var REGEX_IS_RGB = /^[a-z0-9]{6}$/;


function clean_param(value){
	var splitted = value.split(':');
	var cleaned = {
		str: splitted[0]
	};

    // remove leading '#'
    var rgb = (splitted[1] || '').replace(/^#/, '').toLowerCase();

    if(REGEX_IS_SHORT_RGB.test(rgb)){

    	// 'fff' -> 'ffffff'
    	cleaned.rgb = [0, 1, 2].map(function(index) {
    	    var c = rgb.charAt(index);
    	    return c + c;

    	}).join('');

    }else if( REGEX_IS_RGB.test(rgb) ){
    	cleaned.rgb = rgb;
    }

    return cleaned;
};


exports.rgb = function(value) {
    var cleaned = clean_param(value);

    return cleaned.rgb ? RGB.foreground( cleaned.str, RGB.to_object(cleaned.rgb) ) : cleaned.str;
};


exports['bg.rgb'] = function(value) {
    var cleaned = clean_param(value);

    return cleaned.rgb ? RGB.background( cleaned.str, RGB.to_object(cleaned.rgb) ) : cleaned.str;
};