/**
 * @file 往字符串连接对象中添加字符串
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');

/**
 * 往字符串连接对象中添加字符串
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} str 要添加的字符串
 */
var htmlBufferPush = isCompatStrJoin
    ? function (buf, str) {
        buf.raw[buf.length++] = str;
        buf.tagStart = 0;
    }
    : function (buf, str) {
        buf.raw += str;
    };

exports = module.exports = htmlBufferPush;
