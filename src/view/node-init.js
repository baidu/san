/**
 * @file  初始化节点
 * @author errorrik(errorrik@gmail.com)
 */

var guid = require('../util/guid');
var isComponent = require('./is-component');

/**
 * 初始化节点
 *
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 * @param {Object?} node 节点对象，允许为空。空时将options作为节点对象，避免重复创建
 * @return {Object}
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

    node.id = guid();

    return node;
}


exports = module.exports = nodeInit;
