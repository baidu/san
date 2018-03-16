/**
 * @file 更新元素的子元素视图
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 更新元素的子元素视图
 *
 * @param {Object} element 要更新的元素
 * @param {Array} changes 数据变化信息
 */
function elementUpdateChildren(element, changes) {
    for (var i = 0, l = element.children.length; i < l; i++) {
        element.children[i]._update(changes);
    }
}

exports = module.exports = elementUpdateChildren;
