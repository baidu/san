/**
 * @file 通知节点和childs完成attached状态
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 通知节点和childs完成attached状态
 *
 * @param {Object} node 节点对象
 */
function nodeToAttached(node) {
    each(node.childs, function (child) {
        child._toAttached && child._toAttached();
    });

    if (!node.lifeCycle.is('created')) {
        node._toPhase('created');
    }

    if (!node.lifeCycle.is('attached')) {
        if (node._attached) {
            node._attached();
        }
        node._toPhase('attached');
    }
}


exports = module.exports = nodeToAttached;