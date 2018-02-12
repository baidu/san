/**
 * @file 生成元素标签结束的html
 * @author errorrik(errorrik@gmail.com)
 */

var autoCloseTags = require('../browser/auto-close-tags');
var htmlBufferPush = require('../runtime/html-buffer-push');

/**
 * 生成元素标签结束的html
 *
 * @inner
 * @param {Element} element 元素
 * @param {Object} buf html串存储对象
 */
function genElementEndHTML(element, buf) {
    var tagName = element.tagName;

    if (!autoCloseTags[tagName]) {
        htmlBufferPush(buf, '</' + tagName + '>');
    }
}

exports = module.exports = genElementEndHTML;
