/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将字符串逗号切分返回对象
 */

var each = require('../util/each');

/**
 * 将字符串逗号切分返回对象
 *
 * @param {string} source 源字符串
 * @return {Object}
 */
function splitStr2Obj(source) {
    var result = {};
    each(
        source.split(','),
        function (key) {
            result[key] = key;
        }
    );
    return result;
}

exports = module.exports = splitStr2Obj;
