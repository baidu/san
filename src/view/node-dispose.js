/**
 * @file 销毁节点
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 销毁节点
 *
 * @param {Object} node 节点对象
 */
function nodeDispose(node) {
    node.el = null;
    node.owner = null;
    node.scope = null;
    node.aNode = null;
    node.parent = null;
    node.parentComponent = null;
    node.childs = null;
}


exports = module.exports = nodeDispose;