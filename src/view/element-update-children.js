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
 * @param {string} slotChildrenName 子slot名称
 */
function elementUpdateChildren(element, changes, slotChildrenName) {
    each(element.children, function (child) {
        child._update(changes);
    });

    each(element[slotChildrenName || 'slotChildren'], function (child) {
        elementUpdateChildren(child, changes);
    });
}

exports = module.exports = elementUpdateChildren;
