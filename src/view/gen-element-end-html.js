/**
 * @file 生成元素标签结束的html
 * @author errorrik(errorrik@gmail.com)
 */

var autoCloseTags = require('../browser/auto-close-tags');
var pushStrBuffer = require('../runtime/push-str-buffer');

/**
 * 生成元素标签结束的html
 *
 * @inner
 * @param {Element} element 元素
 * @param {StringBuffer} buf html串存储对象
 */
function genElementEndHTML(element, buf) {
    var tagName = element.tagName;

    if (!autoCloseTags[tagName]) {
        pushStrBuffer(buf, '</');
        pushStrBuffer(buf, tagName);
        pushStrBuffer(buf, '>');
    }
}

exports = module.exports = genElementEndHTML;
