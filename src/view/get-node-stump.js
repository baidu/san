/**
 * @file  获取节点 stump 的 comment
 * @author errorrik(errorrik@gmail.com)
 */


var getNodeStumpParent = require('./get-node-stump-parent');

/**
 * 获取节点 stump 的 comment
 *
 * @param {Node} node 节点对象
 * @return {Comment}
 */
function getNodeStump(node) {
    if (typeof node.el === 'undefined') {
        var parentNode = getNodeStumpParent(node);
        var el = parentNode.firstChild;

        while (el) {
            if (el.nodeType === 8
                && el.data.indexOf('san:') === 0
                && el.data.replace('san:', '') === node.id
            ) {
                break;
            }

            el = el.nextSibling;
        }

        node.el = el;
    }

    return node.el;
}

exports = module.exports = getNodeStump;
