/**
 * @file 判断一个node是否组件
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 判断一个node是否组件
 *
 * @param {Node} node 节点实例
 * @return {boolean}
 */
function isComponent(node) {
    return node && node._type === 'san-cmpt';
}

exports = module.exports = isComponent;
