/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 处理元素的属性操作
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
