/**
 * @file 判断一个node是否if
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 判断一个node是否if
 *
 * @param {Node} node 节点实例
 * @return {boolean}
 */
function isIf(node) {
    return node && node._type === 'san-if';
}

exports = module.exports = isIf;
