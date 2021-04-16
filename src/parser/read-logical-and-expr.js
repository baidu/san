/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取逻辑与表达式
 */

var ExprType = require('./expr-type');
var readEqualityExpr = require('./read-equality-expr');

/**
 * 读取逻辑与表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readLogicalANDExpr(walker) {
    var expr = readEqualityExpr(walker);
    walker.goUntil();

    if (walker.source.charCodeAt(walker.index) === 38) { // &
        if (walker.nextCode() === 38) {
            walker.index++;
            return {
                type: ExprType.BINARY,
                operator: 76,
                segs: [expr, readLogicalANDExpr(walker)]
            };
        }

        walker.index--;
    }

    return expr;
}

exports = module.exports = readLogicalANDExpr;
