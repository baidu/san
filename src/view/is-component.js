/**
 * @file 判断一个node是否组件
 * @author errorrik(errorrik@gmail.com)
 */

var NodeType = require('./node-type');

/**
 * 判断一个node是否组件
 *
 * @param {Node} node 节点实例
 * @return {boolean}
 */
function isComponent(node) {
    return node && node._type === NodeType.CMPT;
}

exports = module.exports = isComponent;
