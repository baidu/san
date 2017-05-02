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
 * 写个用于跨平台提高性能的字符串连接类
 * 万一不小心支持老式浏览器了呢
 *
 * @class
 */
function StringBuffer() {
    this.raw = isCompatStringJoin ? [] : '';
    this.length = 0;
}

/**
 * 获取连接的字符串结果
 *
 * @return {string}
 */
StringBuffer.prototype.toString = function () {
    return isCompatStringJoin ? this.raw.join('') : this.raw;
};

/**
 * 增加字符串片段
 * 就不支持多参数，别问我为什么，这东西也不是给外部用的
 *
 * @param {string} source 字符串片段
 */
StringBuffer.prototype.push = isCompatStringJoin
    ? function (source) {
        this.raw[this.length++] = source;
    }
    : function (source) {
        this.length++;
        this.raw += source;
    };

exports = module.exports = StringBuffer;
