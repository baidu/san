/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将元素从页面上移除
 */

var elementLeave = require('./element-leave');

/**
 * 将元素从页面上移除
 */
function elementOwnDetach() {
    elementLeave(this);
}


exports = module.exports = elementOwnDetach;
