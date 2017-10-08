/**
 * @file 创建字符串连接对象，用于跨平台提高性能的字符串连接，万一不小心支持老式浏览器了呢
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');

/**
 * 创建字符串连接对象
 *
 * @return {Object}
 */
function createStrBuffer() {
    return {
        raw: isCompatStrJoin ? [] : '',
        length: 0
    };
}

exports = module.exports = createStrBuffer;
