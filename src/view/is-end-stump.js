/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 判断是否结束桩
 */

// #[begin] reverse
/**
 * 判断是否结束桩
 *
 * @param {HTMLElement|HTMLComment} target 要判断的元素
 * @param {string} type 桩类型
 * @return {boolean}
 */
function isEndStump(target, type) {
    return target.nodeType === 8 && target.data === '/s-' + type;
}
// #[end]

exports = module.exports = isEndStump;
