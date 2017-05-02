/**
 * @file SVG标签表
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');

/**
 * svgTags
 *
 * @see https://www.w3.org/TR/SVG/svgdtd.html 只取常用
 * @type {Object}
 */
var svgTags = {};
each((''
        // structure
        + 'svg,g,defs,desc,metadata,symbol,use,'
        // image & shape
        + 'image,path,rect,circle,line,ellipse,polyline,polygon,'
        // text
        + 'text,tspan,tref,textpath,'
        // other
        + 'marker,pattern,clippath,mask,filter,cursor,view,animate,'
        // font
        + 'font,font-face,glyph,missing-glyph'
    ).split(','),
    function (key) {
        svgTags[key] = 1;
    }
);

exports = module.exports = svgTags;
