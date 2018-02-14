/**
 * @file 往字符串连接对象中添加字符串
 * @author errorrik(errorrik@gmail.com)
 */

var ieOldThan9 = require('../browser/ie-old-than-9');

/**
 * 往字符串连接对象中添加字符串
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} str 要添加的字符串
 */
var htmlBufferPush = ieOldThan9
    ? function (buf, str) {
        buf.raw[buf.length++] = str;
        buf.tagStart = 0;
    }
    : function (buf, str) {
        buf.raw += str;
    };

exports = module.exports = htmlBufferPush;
