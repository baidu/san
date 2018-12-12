/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析表达式
 */

var Walker = require('./walker');
var readTertiaryExpr = require('./read-tertiary-expr');

/**
 * 解析表达式
 *
 * @param {string} source 源码
 * @return {Object}
 */
function parseExpr(source) {
    if (!source) {
        return;
    }

    if (typeof source === 'object' && source.type) {
        return source;
    }

    var expr = readTertiaryExpr(new Walker(source));
    expr.raw = source;
    return expr;
}

exports = module.exports = parseExpr;
