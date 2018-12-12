/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 简单执行销毁节点的行为
 */

var removeEl = require('../browser/remove-el');
var nodeDispose = require('./node-dispose');
var elementDisposeChildren = require('./element-dispose-children');

/**
 * 简单执行销毁节点的行为
 *
 * @param {boolean=} noDetach 是否不要把节点从dom移除
 */
function nodeOwnSimpleDispose(noDetach) {
    elementDisposeChildren(this.children, noDetach, 1);

    if (!noDetach) {
        removeEl(this.el);
    }

    nodeDispose(this);
}

exports = module.exports = nodeOwnSimpleDispose;
