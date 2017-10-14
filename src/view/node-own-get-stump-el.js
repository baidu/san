/**
 * @file 获取节点对应的 stump 主元素
 * @author errorrik(errorrik@gmail.com)
 */

var getNodeStump = require('./get-node-stump');

/**
 * 获取节点对应的 stump 主元素
 *
 * @return {Comment}
 */
function nodeOwnGetStumpEl() {
    return getNodeStump(this);
}

exports = module.exports = nodeOwnGetStumpEl;
