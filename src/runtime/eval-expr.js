/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 表达式计算
 */

var ExprType = require('../parser/expr-type');
var extend = require('../util/extend');
var DEFAULT_FILTERS = require('./default-filters');
var evalArgs = require('./eval-args');
var dataCache = require('./data-cache');

/**
 * 计算表达式的值
 *
 * @param {Object} expr 表达式对象
 * @param {Data} data 数据容器对象
 * @param {Component=} owner 所属组件环境
 * @return {*}
 */
function evalExpr(expr, data, owner) {
    if (expr.value != null) {
        return expr.value;
    }

    var value = dataCache.get(data, expr);

    if (value == null) {
        switch (expr.type) {
            case ExprType.UNARY:
                value = evalExpr(expr.expr, data, owner);
                switch (expr.operator) {
                    case 33:
                        value = !value;
                        break;

                    case 45:
                        value = 0 - value;
                        break;
                }
                break;

            case ExprType.BINARY:
                var leftValue = evalExpr(expr.segs[0], data, owner);
                var rightValue = evalExpr(expr.segs[1], data, owner);

                /* eslint-disable eqeqeq */
                switch (expr.operator) {
                    case 37:
                        value = leftValue % rightValue;
                        break;
                    case 43:
                        value = leftValue + rightValue;
                        break;
                    case 45:
                        value = leftValue - rightValue;
                        break;
                    case 42:
                        value = leftValue * rightValue;
                        break;
                    case 47:
                        value = leftValue / rightValue;
                        break;
                    case 60:
                        value = leftValue < rightValue;
                        break;
                    case 62:
                        value = leftValue > rightValue;
                        break;
                    case 76:
                        value = leftValue && rightValue;
                        break;
                    case 94:
                        value = leftValue != rightValue;
                        break;
                    case 121:
                        value = leftValue <= rightValue;
                        break;
                    case 122:
                        value = leftValue == rightValue;
                        break;
                    case 123:
                        value = leftValue >= rightValue;
                        break;
                    case 155:
                        value = leftValue !== rightValue;
                        break;
                    case 183:
                        value = leftValue === rightValue;
                        break;
                    case 248:
                        value = leftValue || rightValue;
                        break;
                }
                /* eslint-enable eqeqeq */
                break;

            case ExprType.TERTIARY:
                value = evalExpr(
                    expr.segs[evalExpr(expr.segs[0], data, owner) ? 1 : 2],
                    data,
                    owner
                );
                break;

            case ExprType.ARRAY:
                value = [];
                for (var i = 0, l = expr.items.length; i < l; i++) {
                    var item = expr.items[i];
                    var itemValue = evalExpr(item.expr, data, owner);

                    if (item.spread) {
                        itemValue && (value = value.concat(itemValue));
                    }
                    else {
                        value.push(itemValue);
                    }
                }
                break;

            case ExprType.OBJECT:
                value = {};
                for (var i = 0, l = expr.items.length; i < l; i++) {
                    var item = expr.items[i];
                    var itemValue = evalExpr(item.expr, data, owner);

                    if (item.spread) {
                        itemValue && extend(value, itemValue);
                    }
                    else {
                        value[evalExpr(item.name, data, owner)] = itemValue;
                    }
                }
                break;

            case ExprType.ACCESSOR:
                value = data.get(expr);
                break;

            case ExprType.INTERP:
                value = evalExpr(expr.expr, data, owner);

                if (owner) {
                    for (var i = 0, l = expr.filters.length; i < l; i++) {
                        var filter = expr.filters[i];
                        var filterName = filter.name.paths[0].value;

                        if (owner.filters[filterName]) {
                            value = owner.filters[filterName].apply(
                                owner,
                                [value].concat(evalArgs(filter.args, data, owner))
                            );
                        }
                        else if (DEFAULT_FILTERS[filterName]) {
                            value = DEFAULT_FILTERS[filterName](value);
                        }
                    }
                }

                if (value == null) {
                    value = '';
                }

                break;

            case ExprType.CALL:
                if (owner && expr.name.type === ExprType.ACCESSOR) {
                    var method = owner;
                    var pathsLen = expr.name.paths.length;

                    for (var i = 0; method && i < pathsLen; i++) {
                        method = method[evalExpr(expr.name.paths[i], data, owner)];
                    }

                    if (method) {
                        value = method.apply(owner, evalArgs(expr.args, data, owner));
                    }
                }

                break;

            /* eslint-disable no-redeclare */
            case ExprType.TEXT:
                var buf = '';
                for (var i = 0, l = expr.segs.length; i < l; i++) {
                    var seg = expr.segs[i];
                    buf += seg.value || evalExpr(seg, data, owner);
                }
                return buf;
        }

        dataCache.set(data, expr, value);
    }

    return value;
}

exports = module.exports = evalExpr;
