/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 获取节点在组件树中的路径
 */


var NodeType = require('./node-type');

// #[begin] hydrate
/**
 * 获取节点在组件树中的路径
 *
 * @param {Node} node 节点对象
 * @return {Array}
 */
/* istanbul ignore next */
function getNodePath(node) {
    var nodePaths = [];
    var nodeParent = node;
    while (nodeParent) {
        switch (nodeParent.nodeType) {
            case NodeType.ELEM:
                nodePaths.unshift(nodeParent.tagName);
                break;

            case NodeType.IF:
                nodePaths.unshift('if');
                break;

            case NodeType.FOR:
                nodePaths.unshift('for[' + nodeParent.aNode.directives['for'].item + ']'); // eslint-disable-line dot-notation
                break;

            case NodeType.SLOT:
                nodePaths.unshift('slot[' + (nodeParent.name || 'default') + ']');
                break;

            case NodeType.FRAG:
                nodePaths.unshift('fragment');
                break;

            case NodeType.CMPT:
                nodePaths.unshift('component[' + (nodeParent.source ? nodeParent.source.tagName : 'root') + ']');
                break;

            case NodeType.TEXT:
                nodePaths.unshift('text');
                break;
        }

        nodeParent = nodeParent.parent;
    }

    return nodePaths;
}
// #[end]

exports = module.exports = getNodePath;
