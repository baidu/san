/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建模板组件类
 */

var TemplateComponent = require('./template-component');
var inherits = require('../util/inherits');
 
/**
 * 创建组件类
 *
 * @param {Object|string} template 模板组件类的方法表或模板字符串
 * @return {Function}
 */
function defineTemplateComponent(template) {
     // 如果传入一个不是 san component 的 constructor，直接返回不是组件构造函数
     // 这种场景导致的错误 san 不予考虑
    switch (typeof template) {
        case 'function':
            return template;

        case 'string':
            template = {template: template};
        // #[begin] error
            break;

        case 'object':
            break;

        default:
            throw new Error('[SAN FATAL] defineTemplateComponent need string or plain object.');
        // #[end]
    }
 
    function ComponentClass(option) { // eslint-disable-line
        TemplateComponent.call(this, option);
    }
 
    ComponentClass.prototype = template;
    inherits(ComponentClass, TemplateComponent);
 
    return ComponentClass;
}
 
exports = module.exports = defineTemplateComponent;