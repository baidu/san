/**
 * @file 自闭合标签表
 * @author errorrik(errorrik@gmail.com)
 */

var splitStr2Obj = require('../util/split-str-2-obj');

/**
 * 自闭合标签列表
 *
 * @type {Object}
 */
var hotTags = splitStr2Obj('div,span,input,button,textarea,form,label,dl,dt,dd,ul,ol,li,a,b,u,h1,h2,h3,h4,h5,h6');

exports = module.exports = hotTags;
