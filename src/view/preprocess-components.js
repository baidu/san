/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 预处理组件的 components
 */

var defineComponent = require('./define-component');
var ComponentLoader = require('./component-loader');

/**
 * 预处理组件的 components
 *
 * @param {Function} ComponentClass 组件类
 * @return {ANode}
 */
function preprocessComponents(ComponentClass) {
    var proto = ComponentClass.prototype;

    // preproccess components class
    proto.components = ComponentClass.components || proto.components || {};
    var components = proto.components;

    for (var key in components) { // eslint-disable-line
        var cmptClass = components[key];
        if (typeof cmptClass === 'object' && !(cmptClass instanceof ComponentLoader)) {
            components[key] = defineComponent(cmptClass);
        }
        else if (cmptClass === 'self') {
            components[key] = ComponentClass;
        }
    }

    proto._cmptReady = 1;
}

exports = module.exports = preprocessComponents;