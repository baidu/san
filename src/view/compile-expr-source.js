/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 编译源码的 helper 方法集合
 */

var each = require('../util/each');
var ExprType = require('../parser/expr-type');

// #[begin] ssr

/**
 * 编译源码的 helper 方法集合对象
 */
var compileExprSource = {

    /**
     * 字符串字面化
     *
     * @param {string} source 需要字面化的字符串
     * @return {string} 字符串字面化结果
     */
    stringLiteralize: function (source) {
        return '"'
            + source
                .replace(/\x5C/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\x0A/g, '\\n')
                .replace(/\x09/g, '\\t')
                .replace(/\x0D/g, '\\r')
                // .replace( /\x08/g, '\\b' )
                // .replace( /\x0C/g, '\\f' )
            + '"';
    },

    /**
     * 生成数据访问表达式代码
     *
     * @param {Object?} accessorExpr accessor表达式对象
     * @return {string}
     */
    dataAccess: function (accessorExpr) {
        var code = 'componentCtx.data';
        if (accessorExpr) {
            each(accessorExpr.paths, function (path) {
                if (path.type === ExprType.ACCESSOR) {
                    code += '[' + compileExprSource.dataAccess(path) + ']';
                    return;
                }

                switch (typeof path.value) {
                    case 'string':
                        code += '.' + path.value;
                        break;

                    case 'number':
                        code += '[' + path.value + ']';
                        break;
                }
            });
        }

        return code;
    },

    /**
     * 生成调用表达式代码
     *
     * @param {Object?} callExpr 调用表达式对象
     * @return {string}
     */
    callExpr: function (callExpr) {
        var paths = callExpr.name.paths;
        var code = 'componentCtx.proto.' + paths[0].value;

        for (var i = 1; i < paths.length; i++) {
            var path = paths[i];

            switch (path.type) {
                case ExprType.STRING:
                    code += '.' + path.value;
                    break;

                case ExprType.NUMBER:
                    code += '[' + path.value + ']';
                    break;

                default:
                    code += '[' + compileExprSource.expr(path) + ']';
            }
        }

        code += '(';
        each(callExpr.args, function (arg, index) {
            code += (index > 0 ? ', ' : '') + compileExprSource.expr(arg);
        });
        code += ')';

        return code;
    },

    /**
     * 生成插值代码
     *
     * @param {Object} interpExpr 插值表达式对象
     * @return {string}
     */
    interp: function (interpExpr) {
        var code = compileExprSource.expr(interpExpr.expr);


        each(interpExpr.filters, function (filter) {
            var filterName = filter.name.paths[0].value;

            switch (filterName) {
                case '_style':
                case '_xstyle':
                case '_class':
                case '_xclass':
                    code = filterName + 'Filter(' + code + ')';
                    break;

                case 'url':
                    code = 'encodeURIComponent(' + code + ')';
                    break;

                default:
                    code = 'callFilter(componentCtx, "' + filterName + '", [' + code;
                    each(filter.args, function (arg) {
                        code += ', ' + compileExprSource.expr(arg);
                    });
                    code += '])';
            }

        });

        if (!interpExpr.original) {
            return 'escapeHTML(' + code + ')';
        }

        return code;
    },

    /**
     * 生成文本片段代码
     *
     * @param {Object} textExpr 文本片段表达式对象
     * @return {string}
     */
    text: function (textExpr) {
        if (textExpr.segs.length === 0) {
            return '""';
        }

        var code = '';

        each(textExpr.segs, function (seg) {
            var segCode = compileExprSource.expr(seg);
            code += code ? ' + ' + segCode : segCode;
        });

        return code;
    },

    /**
     * 生成数组字面量代码
     *
     * @param {Object} arrayExpr 数组字面量表达式对象
     * @return {string}
     */
    array: function (arrayExpr) {
        var code = [];

        each(arrayExpr.items, function (item) {
            code.push((item.spread ? '...' : '') + compileExprSource.expr(item.expr));
        });

        return '[\n' + code.join(',\n') + '\n]';
    },

    /**
     * 生成对象字面量代码
     *
     * @param {Object} objExpr 对象字面量表达式对象
     * @return {string}
     */
    object: function (objExpr) {
        var code = [];

        each(objExpr.items, function (item) {
            if (item.spread) {
                code.push('...' + compileExprSource.expr(item.expr));
            }
            else {
                code.push(compileExprSource.expr(item.name) + ':' + compileExprSource.expr(item.expr));
            }
        });

        return '{\n' + code.join(',\n') + '\n}';
    },

    /**
     * 二元表达式操作符映射表
     *
     * @type {Object}
     */
    binaryOp: {
        /* eslint-disable */
        43: '+',
        45: '-',
        42: '*',
        47: '/',
        60: '<',
        62: '>',
        76: '&&',
        94: '!=',
        121: '<=',
        122: '==',
        123: '>=',
        155: '!==',
        183: '===',
        248: '||'
        /* eslint-enable */
    },

    /**
     * 生成表达式代码
     *
     * @param {Object} expr 表达式对象
     * @return {string}
     */
    expr: function (expr) {
        if (expr.parenthesized) {
            return '(' + compileExprSource._expr(expr) + ')';
        }

        return compileExprSource._expr(expr);
    },

    /**
     * 根据表达式类型进行生成代码函数的中转分发
     *
     * @param {Object} expr 表达式对象
     * @return {string}
     */
    _expr: function (expr) {
        switch (expr.type) {
            case ExprType.UNARY:
                switch (expr.operator) {
                    case 33:
                        return '!' + compileExprSource.expr(expr.expr);
                    case 45:
                        return '-' + compileExprSource.expr(expr.expr);
                }
                return '';

            case ExprType.BINARY:
                return compileExprSource.expr(expr.segs[0])
                    + compileExprSource.binaryOp[expr.operator]
                    + compileExprSource.expr(expr.segs[1]);

            case ExprType.TERTIARY:
                return compileExprSource.expr(expr.segs[0])
                    + '?' + compileExprSource.expr(expr.segs[1])
                    + ':' + compileExprSource.expr(expr.segs[2]);

            case ExprType.STRING:
                return compileExprSource.stringLiteralize(expr.literal || expr.value);

            case ExprType.NUMBER:
                return expr.value;

            case ExprType.BOOL:
                return expr.value ? 'true' : 'false';

            case ExprType.ACCESSOR:
                return compileExprSource.dataAccess(expr);

            case ExprType.INTERP:
                return compileExprSource.interp(expr);

            case ExprType.TEXT:
                return compileExprSource.text(expr);

            case ExprType.ARRAY:
                return compileExprSource.array(expr);

            case ExprType.OBJECT:
                return compileExprSource.object(expr);

            case ExprType.CALL:
                return compileExprSource.callExpr(expr);
        }
    }
};
// #[end]

exports = module.exports = compileExprSource;
