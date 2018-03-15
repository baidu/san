/**
 * @file 将元素从页面上移除
 * @author errorrik(errorrik@gmail.com)
 */

var removeEl = require('../browser/remove-el');
var elementLeave = require('./element-leave');

/**
 * 将元素从页面上移除
 */
function elementOwnDetach() {
    elementLeave(this);
}


exports = module.exports = elementOwnDetach;
