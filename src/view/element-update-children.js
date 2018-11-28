/**
 * @file 更新元素的子元素视图
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 更新元素的子元素视图
 *
 * @param {Array} children 子元素列表
 * @param {Array} changes 数据变化信息
 */
function elementUpdateChildren(children, changes) {
    for (var i = 0, l = children.length; i < l; i++) {
        children[i]._update(changes);
    }
}

exports = module.exports = elementUpdateChildren;
