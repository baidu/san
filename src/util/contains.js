/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 判断数组中是否包含某项
 */

var each = require('./each');

/**
 * 判断数组中是否包含某项
 *
 * @param {Array} array 数组
 * @param {*} value 包含的项
 * @return {boolean}
 */
function contains(array, value) {
    var result = false;
    each(array, function (item) {
        result = item === value;
        return !result;
    });

    return result;
}

exports = module.exports = contains;
