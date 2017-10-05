/**
 * @file  初始化节点
 * @author errorrik(errorrik@gmail.com)
 */

var guid = require('../util/guid');

/**
 * 初始化节点
 *
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 */
function nodeInit(options, node) {
    node = node || options || {};

    if (node !== options) {
        node.owner = options.owner;
        node.parent = options.parent;
        node.scope = options.scope;
        node.aNode = node.aNode || options.aNode;
        node.el = options.el;
    }

    node.parentComponent = isComponent(options.parent)
            ? options.parent
            : options.parent && options.parent.parentComponent,

    node.id = (options.el && options.el.id)
            || (options.aNode && options.aNode.id)
            || guid();

    return node;
}


exports = module.exports = nodeInit;