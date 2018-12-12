/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 销毁释放元素的子元素
 */

/**
 * 销毁释放元素的子元素
 *
 * @param {Array=} children 子元素数组
 * @param {boolean=} noDetach 是否不要把节点从dom移除
 * @param {boolean=} noTransition 是否不显示过渡动画效果
 */
function elementDisposeChildren(children, noDetach, noTransition) {
    var len = children && children.length;
    while (len--) {
        children[len].dispose(noDetach, noTransition);
    }
}

exports = module.exports = elementDisposeChildren;
