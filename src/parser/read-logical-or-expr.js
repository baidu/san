/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取逻辑或表达式
 */

var ExprType = require('./expr-type');
var readLogicalANDExpr = require('./read-logical-and-expr');

/**
 * 读取逻辑或表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readLogicalORExpr(walker) {
    var expr = readLogicalANDExpr(walker);
    walker.goUntil();

    if (walker.currentCode() === 124) { // |
        if (walker.nextCode() === 124) {
            walker.go(1);
            return {
                type: ExprType.BINARY,
                operator: 248,
                segs: [expr, readLogicalORExpr(walker)]
            };
        }

        walker.go(-1);
    }

    return expr;
}

exports = module.exports = readLogicalORExpr;
