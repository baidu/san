/**
 * @file 往html字符串连接对象中添加注释
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');
var empty = require('../util/empty');

/**
 * 往html字符串连接对象中添加注释
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} str 要添加的字符串
 */
var htmlBufferTagStart = isCompatStrJoin
    ? function (buf, id) {
        buf.tagId = id;
        buf.tagStart = 1;
    }
    : empty;

exports = module.exports = htmlBufferTagStart;
