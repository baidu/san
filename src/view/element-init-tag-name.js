/**
 * @file 初始化 element 节点的 tagName 处理
 * @author errorrik(errorrik@gmail.com)
 */

var ieOldThan9 = require('../browser/ie-old-than-9');

/**
 * 初始化 element 节点的 tagName 处理
 *
 * @param {Object} node 节点对象
 */
function elementInitTagName(node) {
    node.tagName = node.tagName || node.aNode.tagName || 'div';

    // #[begin] allua
    // ie8- 不支持innerHTML输出自定义标签
    if (ieOldThan9 && node.tagName.indexOf('-') > 0) {
        node.tagName = 'div';
    }
    // #[end]
}


exports = module.exports = elementInitTagName;
