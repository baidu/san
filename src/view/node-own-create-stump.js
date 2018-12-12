/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建节点对应的 stump comment 元素
 */



/**
 * 创建节点对应的 stump comment 主元素
 */
function nodeOwnCreateStump() {
    this.el = this.el || document.createComment(this.id);
}

exports = module.exports = nodeOwnCreateStump;
