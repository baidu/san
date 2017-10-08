/**
 * @file 字符串连接时是否使用老式的兼容方案
 * @author errorrik(errorrik@gmail.com)
 */


var ie = require('./ie');

/**
 * 字符串连接时是否使用老式的兼容方案
 *
 * @inner
 * @type {boolean}
 */
var isCompatStrJoin = ie && ie < 8;

exports = module.exports = isCompatStrJoin;
