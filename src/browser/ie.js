/**
 * @file ie版本号
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 从userAgent中ie版本号的匹配信息
 *
 * @type {Array}
 */
var ieVersionMatch = typeof navigator !== 'undefined'
    && navigator.userAgent.match(/msie\s*([0-9]+)/i);

/**
 * ie版本号，非ie时为0
 *
 * @type {number}
 */
var ie = ieVersionMatch ? ieVersionMatch[1] - 0 : 0;

exports = module.exports = ie;
