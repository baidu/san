/**
 * @file 设置元素属性
 * @author errorrik(errorrik@gmail.com)
 */


var getPropHandler = require('./get-prop-handler');

/**
 * 设置元素属性
 *
 * @param {Object} element 元素
 * @param {string} name 属性名
 * @param {*} value 属性值
 */
function elementSetElProp(element, name, value) {
    getPropHandler(element, name).prop(element, name, value);
}

exports = module.exports = elementSetElProp;
