'use strict';

var RGB = require('../util/rgb');


var REGEX_IS_SHORT_RGB = /^[a-z0-9]{3}$/;
var REGEX_IS_RGB = /^[a-z0-9]{6}$/;


function create_rgb_object(rgb){
	if(!rgb){
		return null;
	}

    // remove leading '#'
    rgb = rgb.replace(/^#/, '').toLowerCase();

    if(REGEX_IS_SHORT_RGB.test(rgb)){

    	// 'fff' -> 'ffffff'
    	rgb = [0, 1, 2].map(function(index) {
    	    var c = rgb.charAt(index);
    	    return c + c;

    	}).join('');

    }else if( !REGEX_IS_RGB.test(rgb) ){
    	rgb = null;
    }

    return rgb && RGB.to_object(rgb);
};


exports.rgb = function(value) {
	var rgb = create_rgb_object(this.data);
    return rgb ? RGB.foreground( value, rgb ) : value;
};


exports['bg.rgb'] = function(value) {
	var rgb = create_rgb_object(this.data);
    return rgb ? RGB.background( value, rgb ) : value;
};