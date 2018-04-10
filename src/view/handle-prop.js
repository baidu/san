/**
 * @file 处理元素的属性操作
 * @author errorrik(errorrik@gmail.com)
 */

var getPropHandler = require('./get-prop-handler');

/**
 * 处理元素属性操作
 *
 * @param {Object} element 元素对象
 * @param {*} value 属性值
 * @param {Object} prop 属性信息对象
 */
function handleProp(element, value, prop) {
    var name = prop.name;
    getPropHandler(element.tagName, name).prop(element.el, value, name, element, prop);
}

exports = module.exports = handleProp;
