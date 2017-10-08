/**
 * @file 字符串化字符串连接对象
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');

/**
 * 往字符串连接对象中添加字符串
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} str 要添加的字符串
 */
var stringifyStrBuffer = isCompatStrJoin
    ? function (buf) {
        return buf.raw.join('');
    }
    : function (buf) {
        return buf.raw;
    };

exports = module.exports = stringifyStrBuffer;
