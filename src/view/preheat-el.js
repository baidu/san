/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file ANode预热
 */

/**
 * ANode预热HTML元素，用于循环创建时clone
 *
 * @param {Object} aNode 要预热的ANode
 * @return {HTMLElement}
 */
function preheatEl(aNode) {
    var el = createEl(aNode.tagName);
    aNode.hotspot.el = el;

    for (var i = 0, l = aNode.props.length; i < l; i++) {
        var prop = aNode.props[i];
        if (prop.expr.value != null) {
            prop.handler(el, prop.expr.value, prop.name, aNode);
        }
    }

    return el;
}

exports = module.exports = preheatEl;
