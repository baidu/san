/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析调用
 */


var Walker = require('./walker');
var ExprType = require('./expr-type');
var readCall = require('./read-call');

/**
 * 解析调用
 *
 * @param {string} source 源码
 * @param {Array=} defaultArgs 默认参数
 * @return {Object}
 */
function parseCall(source, defaultArgs) {
    var expr = readCall(new Walker(source), defaultArgs);

    if (expr.type !== ExprType.CALL) {
        expr = {
            type: ExprType.CALL,
            name: expr,
            args: defaultArgs || []
        };
    }

    expr.raw = source;
    return expr;
}

exports = module.exports = parseCall;
