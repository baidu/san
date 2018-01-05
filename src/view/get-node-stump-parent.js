/**
 * @file  获取节点 stump 的父元素
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 获取节点 stump 的父元素
 * if、for 节点的 el stump 是 comment node，在 IE 下还可能不存在
 * 获取其父元素通常用于 el 的查找，以及视图变更的插入操作
 *
 * @param {Node} node 节点对象
 * @return {HTMLElement}
 */
function getNodeStumpParent(node) {
    if (node.el) {
        return node.el.parentNode;
    }

    node = node.parent;
    var parentNode;
    while (node) {
        parentNode = node._getEl();
        if (parentNode) {
            while (parentNode && parentNode.nodeType !== 1) {
                parentNode = parentNode.parentNode;
            }
            break;
        }

        node = node.parent;
    }

    return parentNode;
}

exports = module.exports = getNodeStumpParent;
