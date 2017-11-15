/**
 * @file 更新元素的子元素视图
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');

/**
 * 更新元素的子元素视图
 *
 * @param {Object} element 要更新的元素
 * @param {Array} changes 数据变化信息
 */
function elementUpdateChildren(element, changes) {
    each(element.children, function (child) {
        child._update(changes);
    });
}

exports = module.exports = elementUpdateChildren;
