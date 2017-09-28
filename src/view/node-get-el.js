/**
 * @file 获取节点对应的元素
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 获取节点对应的元素
 *
 * @param {Object} node 节点对象
 */
function nodeGetEl(node) {
    if (!node.el) {
        node.el = document.getElementById(node.id);
    }

    return node.el;
}


exports = module.exports = nodeGetEl;