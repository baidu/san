/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取数字
 */


var ExprType = require('./expr-type');
var readUnaryExpr = require('./read-unary-expr');

/**
 * 读取数字
 *
 * @inner
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readNumber(walker) {
    var match = walker.match(/\s*(-?[0-9]+(\.[0-9]+)?)/g, 1);

    if (match) {
        return {
            type: ExprType.NUMBER,
            value: +match[1]
        };
    }
    else if (walker.currentCode() === 45) {
        walker.go(1);
        return {
            type: ExprType.UNARY,
            expr: readUnaryExpr(walker),
            operator: 45
        };
    }
}

exports = module.exports = readNumber;
