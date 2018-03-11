/**
 * @file 表达式计算
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('../parser/expr-type');
var DEFAULT_FILTERS = require('./default-filters');
var escapeHTML = require('./escape-html');
var evalArgs = require('./eval-args');
var findMethod = require('./find-method');
var each = require('../util/each');

/**
 * 计算表达式的值
 *
 * @param {Object} expr 表达式对象
 * @param {Data} data 数据容器对象
 * @param {Component=} owner 所属组件环境
 * @param {boolean?} escapeInterpHtml 是否对插值进行html转义
 * @return {*}
 */
function evalExpr(expr, data, owner, escapeInterpHtml) {
    if (expr.value != null) {
        return expr.value;
    }

    switch (expr.type) {
        case ExprType.UNARY:
            return !evalExpr(expr.expr, data, owner);

        case ExprType.BINARY:
            var leftValue = evalExpr(expr.segs[0], data, owner);
            var rightValue = evalExpr(expr.segs[1], data, owner);
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
            return;

        case ExprType.TERTIARY:
            return evalExpr(
                expr.segs[evalExpr(expr.segs[0], data, owner) ? 1 : 2],
                data,
                owner
            );

        case ExprType.ACCESSOR:
            return data.get(expr);

        case ExprType.INTERP:
            var value = evalExpr(expr.expr, data, owner);

            owner && each(expr.filters, function (filter) {
                /* eslint-disable no-use-before-define */
                var filterFn = findMethod(owner.filters, filter.name, data)
                    || findMethod(DEFAULT_FILTERS, filter.name, data);
                /* eslint-enable no-use-before-define */

                if (typeof filterFn === 'function') {
                    var args = [value].concat(evalArgs(filter.args, data, owner));
                    value = filterFn.apply(owner, args);
                }
            });

            if (value == null) {
                value = '';
            }

            // escape html
            if (escapeInterpHtml && !expr.raw) {
                value = escapeHTML(value);
            }

            return value;

        case ExprType.TEXT:
            var buf = '';
            for (var i = 0, l = expr.segs.length; i < l; i++) {
                var seg = expr.segs[i];
                buf += seg.value || evalExpr(seg, data, owner, escapeInterpHtml);
            }
            return buf;
    }
}

exports = module.exports = evalExpr;
