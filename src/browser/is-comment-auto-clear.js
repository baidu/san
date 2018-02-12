/**
 * @file 头尾的 comment 节点是否会被浏览器自动干掉
 *       已知ie9-会多此一举
 * @author errorrik(errorrik@gmail.com)
 */


var ie = require('./ie');

/**
 * 头尾的 comment 节点是否会被浏览器自动干掉
 *
 * @inner
 * @type {boolean}
 */
var isCommentAutoClear = ie && ie < 9;

exports = module.exports = isCommentAutoClear;
