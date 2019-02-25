/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 销毁元素节点
 */


var un = require('../browser/un');
var removeEl = require('../browser/remove-el');
var elementUnEl = require('./element-un-el');
var nodeDispose = require('./node-dispose');

/**
 * 销毁元素节点
 *
 * @param {Object} element 要销毁的元素节点
 * @param {Object=} options 销毁行为的参数
 */
function elementDispose(element) {
    var len = element.children.length;
    while (len--) {
        element.children[len].dispose(1, 1);
    }

    elementUnEl(element);

    // 如果没有parent，说明是一个root component，一定要从dom树中remove
    if (!element.disposeNoDetach || !element.parent) {
        removeEl(element.el);
    }

    if (element._toPhase) {
        element._toPhase('detached');
    }

    element.el = null;
    element.sel = null;
    element.owner = null;
    element.scope = null;
    element.children = null;

    if (element._toPhase) {
        element._toPhase('disposed');
    }

    if (element._ondisposed) {
        element._ondisposed();
    }
}


exports = module.exports = elementDispose;
