/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 更新元素的子元素视图
 */


/**
 * 更新元素的子元素视图
 *
 * @param {Array} children 子元素列表
 * @param {Array} changes 数据变化信息
 */
function elementUpdateChildren(children, changes) {
    for (var i = 0, l = children.length; i < l; i++) {
        children[i]._update(changes);
    }
}

exports = module.exports = elementUpdateChildren;
