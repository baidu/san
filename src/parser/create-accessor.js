/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建访问表达式对象
 */

var ExprType = require('./expr-type');

/**
 * 创建访问表达式对象
 *
 * @param {Array} paths 访问路径
 * @return {Object}
 */
function createAccessor(paths) {
    return {
        type: ExprType.ACCESSOR,
        paths: paths
    };
}

exports = module.exports = createAccessor;
