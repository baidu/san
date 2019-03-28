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

    var value;

    switch (expr.type) {
        case ExprType.UNARY:
            value = evalExpr(expr.expr, data, owner);
            switch (expr.operator) {
                case 33:
                    return !value;

                case 45:
                    return 0 - value;
            }
            return value;

        case ExprType.BINARY:
            var leftValue = evalExpr(expr.segs[0], data, owner);
            var rightValue = evalExpr(expr.segs[1], data, owner);

            /* eslint-disable eqeqeq */
            switch (expr.operator) {
                case 37:
                    return leftValue % rightValue;

                case 43:
                    return leftValue + rightValue;

                case 45:
                    return leftValue - rightValue;

                case 42:
                    return leftValue * rightValue;

                case 47:
                    return leftValue / rightValue;

                case 60:
                    return leftValue < rightValue;

                case 62:
                    return leftValue > rightValue;

                case 76:
                    return leftValue && rightValue;

                case 94:
                    return leftValue != rightValue;

                case 121:
                    return leftValue <= rightValue;

                case 122:
                    return leftValue == rightValue;

                case 123:
                    return leftValue >= rightValue;

                case 155:
                    return leftValue !== rightValue;

                case 183:
                    return leftValue === rightValue;

                case 248:
                    return leftValue || rightValue;

            }
            /* eslint-enable eqeqeq */
            return;

        case ExprType.TERTIARY:
            return evalExpr(
                expr.segs[evalExpr(expr.segs[0], data, owner) ? 1 : 2],
                data,
                owner
            );


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
            return value;

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
            return value;

        case ExprType.ACCESSOR:
            return data.get(expr);


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

            return value;

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

    return value;
}

exports = module.exports = evalExpr;
