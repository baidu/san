/**
 * @file 创建节点对应的 stump comment 元素
 * @author errorrik(errorrik@gmail.com)
 */



/**
 * 创建节点对应的 stump comment 主元素
 */
function nodeOwnCreateStump() {
    this.el = this.el || document.createComment(this.id);
}

exports = module.exports = nodeOwnCreateStump;
