/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 比较变更表达式与目标表达式之间的关系
 */

var ExprType = require('../parser/expr-type');
var evalExpr = require('./eval-expr');

/**
 * 判断变更表达式与多个表达式之间的关系，0为完全没关系，1为有关系
 *
 * @inner
 * @param {Object} changeExpr 目标表达式
 * @param {Array} exprs 多个源表达式
 * @param {Data} data 表达式所属数据环境
 * @return {number}
 */
function changeExprCompareExprs(changeExpr, exprs, data) {
    for (var i = 0, l = exprs.length; i < l; i++) {
        if (changeExprCompare(changeExpr, exprs[i], data)) {
            return 1;
        }
    }

    return 0;
}

/**
 * 比较变更表达式与目标表达式之间的关系，用于视图更新判断
 * 视图更新需要根据其关系，做出相应的更新行为
 *
 * 0: 完全没关系
 * 1: 变更表达式是目标表达式的母项(如a与a.b) 或 表示需要完全变化
 * 2: 变更表达式是目标表达式相等
 * >2: 变更表达式是目标表达式的子项，如a.b.c与a.b
 *
 * @param {Object} changeExpr 变更表达式
 * @param {Object} expr 要比较的目标表达式
 * @param {Data} data 表达式所属数据环境
 * @return {number}
 */
function changeExprCompare(changeExpr, expr, data) {
    var result = 0;
    if (!expr.changeCache) {
        expr.changeCache = {};
    }

    if (changeExpr.raw && !expr.dynamic) {
        if (expr.changeCache[changeExpr.raw] != null) {
            return expr.changeCache[changeExpr.raw];
        }
    }

    switch (expr.type) {
        case ExprType.ACCESSOR:
            var paths = expr.paths;
            var pathsLen = paths.length;
            var changePaths = changeExpr.paths;
            var changeLen = changePaths.length;

            result = 1;
            for (var i = 0; i < pathsLen; i++) {
                var pathExpr = paths[i];
                var pathExprValue = pathExpr.value;

                if (pathExprValue == null && changeExprCompare(changeExpr, pathExpr, data)) {
                    result = 1;
                    break;
                }

                if (result && i < changeLen
                    /* eslint-disable eqeqeq */
                    && (pathExprValue || evalExpr(pathExpr, data)) != changePaths[i].value
                    /* eslint-enable eqeqeq */
                ) {
                    result = 0;
                }
            }

            if (result) {
                result = Math.max(1, changeLen - pathsLen + 2);
            }
            break;

        case ExprType.UNARY:
            result = changeExprCompare(changeExpr, expr.expr, data) ? 1 : 0;
            break;

        case ExprType.TEXT:
        case ExprType.BINARY:
        case ExprType.TERTIARY:
            result = changeExprCompareExprs(changeExpr, expr.segs, data);
            break;

        case ExprType.ARRAY:
        case ExprType.OBJECT:
            for (var i = 0; i < expr.items.length; i++) {
                if (changeExprCompare(changeExpr, expr.items[i].expr, data)) {
                    result = 1;
                    break;
                }
            }

            break;

        case ExprType.INTERP:
            if (changeExprCompare(changeExpr, expr.expr, data)) {
                result = 1;
            }
            else {
                for (var i = 0; i < expr.filters.length; i++) {
                    if (changeExprCompareExprs(changeExpr, expr.filters[i].args, data)) {
                        result = 1;
                        break;
                    }
                }
            }

            break;

        case ExprType.CALL:
            if (changeExprCompareExprs(changeExpr, expr.name.paths, data)
                || changeExprCompareExprs(changeExpr, expr.args, data)
            ) {
                result = 1;
            }
            break;
    }

    if (changeExpr.raw && !expr.dynamic) {
        expr.changeCache[changeExpr.raw] = result;
    }

    return result;
}

exports = module.exports = changeExprCompare;
