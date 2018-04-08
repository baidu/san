/**
 * @file 销毁节点，清空节点上的无用成员
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 销毁节点
 *
 * @param {Object} node 节点对象
 */
function nodeDispose(node) {
    node.el = null;
    node.sel = null;
    node.owner = null;
    node.scope = null;
    node.aNode = null;
    node.parent = null;
    node.parentComponent = null;
    node.children = null;

    if (node._toPhase) {
        node._toPhase('disposed');
    }

    if (node._ondisposed) {
        node._ondisposed();
    }
}

exports = module.exports = nodeDispose;
