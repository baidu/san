/**
 * @file 自闭合标签表
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');

/**
 * 自闭合标签列表
 *
 * @type {Object}
 */
var autoCloseTags = {};
each(
    'area,base,br,col,embed,hr,img,input,keygen,param,source,track,wbr'.split(','),
    function (key) {
        autoCloseTags[key] = 1;
    }
);

exports = module.exports = autoCloseTags;
