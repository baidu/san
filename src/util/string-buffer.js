/**
 * @file 字符串连接类
 * @author errorrik(errorrik@gmail.com)
 */

var ie = require('../browser/ie');

/**
 * 字符串连接时是否使用老式的兼容方案
 *
 * @inner
 * @type {boolean}
 */
var isCompatStringJoin = ie && ie < 8;

/**
 * 写个用于跨平台提高性能的字符串连接
 * 万一不小心支持老式浏览器了呢
 */

function createStrBuffer() {
    return {
        raw: isCompatStringJoin ? [] : '',
        length: 0
    };
}

var pushStrBuffer = isCompatStringJoin
    ? function (buf, str) {
        buf.raw[buf.length++] = str;
    }
    : function (buf, str) {
        buf.raw += str;
    };


function strBufferToStr(buf) {
    if (isCompatStringJoin) {
        return buf.raw.join('');
    }

    return buf.raw;
}

exports = module.exports = StringBuffer;
