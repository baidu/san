/**
 * @file 字符串化字符串连接对象
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');

/**
 * 字符串化字符串连接对象
 *
 * @param {Object} buf 字符串连接对象
 * @return {string}
 */
var stringifyStrBuffer = isCompatStrJoin
    ? function (buf) {
        return buf.raw.join('');
    }
    : function (buf) {
        return buf.raw;
    };

exports = module.exports = stringifyStrBuffer;
