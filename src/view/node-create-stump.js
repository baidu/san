/**
 * @file 创建节点的 stump comment 元素
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 创建节点的 stump comment 主元素
 *
 * @param {Object} node 要创建 stump 主元素的节点
 * @return {HTMLComment}
 */
function nodeCreateStump(node) {
    return document.createComment(node.id);
}

exports = module.exports = nodeCreateStump;
