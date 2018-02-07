/**
 * @file 创建节点对应的 stump comment 元素
 * @author errorrik(errorrik@gmail.com)
 */


var nodeCreateStump = require('./node-create-stump');

/**
 * 创建节点对应的 stump comment 主元素
 */
function nodeOwnCreateStump() {
    this.el = this.el || nodeCreateStump(this);
}

exports = module.exports = nodeOwnCreateStump;
