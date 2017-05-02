/**
 * @file 表达式计算
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('../parser/expr-type');
var BinaryOp = require('./binary-op');
var StringBuffer = require('../util/string-buffer');
var DEFAULT_FILTERS = require('./default-filters');
var escapeHTML = require('./escape-html');
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
            var opHandler = BinaryOp[expr.operator];
            if (typeof opHandler === 'function') {
                return opHandler(
                    evalExpr(expr.segs[0], data, owner),
                    evalExpr(expr.segs[1], data, owner)
                );
            }
            return;

        case ExprType.TERTIARY:
            return evalExpr(
                evalExpr(expr.segs[0], data, owner) ? expr.segs[1] : expr.segs[2],
                data,
                owner
            );

        case ExprType.ACCESSOR:
            return data.get(expr);

        case ExprType.INTERP:
            var value = evalExpr(expr.expr, data, owner);

            owner && each(expr.filters, function (filter) {
                var filterName = filter.name;
                /* eslint-disable no-use-before-define */
                var filterFn = owner.filters[filterName] || DEFAULT_FILTERS[filterName];
                /* eslint-enable no-use-before-define */

                if (typeof filterFn === 'function') {
                    var args = [value];
                    each(filter.args, function (arg) {
                        args.push(evalExpr(arg, data, owner));
                    });

                    value = filterFn.apply(owner, args);
                }
            });

            if (value == null) {
                value = '';
            }

            return value;

        case ExprType.TEXT:
            var buf = new StringBuffer();
            each(expr.segs, function (seg) {
                var segValue = evalExpr(seg, data, owner);

                // escape html
                if (escapeInterpHtml && seg.type === ExprType.INTERP && !seg.filters[0]) {
                    segValue = escapeHTML(segValue);
                }

                buf.push(segValue);
            });
            return buf.toString();
    }
}

exports = module.exports = evalExpr;
