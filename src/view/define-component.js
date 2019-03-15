/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建组件类
 */

var Component = require('./component');
var inherits = require('../util/inherits');

/**
 * 创建组件类
 *
 * @param {Object} proto 组件类的方法表
 * @param {Function=} SuperComponent 父组件类
 * @return {Function}
 */
function defineComponent(proto, SuperComponent) {
    // 如果传入一个不是 san component 的 constructor，直接返回不是组件构造函数
    // 这种场景导致的错误 san 不予考虑
    if (typeof proto === 'function') {
        return proto;
    }

    // #[begin] error
    if (typeof proto !== 'object') {
        throw new Error('[SAN FATAL] defineComponent need a plain object.');
    }
    // #[end]

    function ComponentClass(option) { // eslint-disable-line
        Component.call(this, option);
    }

    ComponentClass.prototype = proto;
    inherits(ComponentClass, SuperComponent || Component);

    return ComponentClass;
}

exports = module.exports = defineComponent;
