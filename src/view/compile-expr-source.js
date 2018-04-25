/**
 * @file 编译源码的 helper 方法集合
 * @author errorrik(errorrik@gmail.com)
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
     * 生成插值代码
     *
     * @param {Object} interpExpr 插值表达式对象
     * @return {string}
     */
    interp: function (interpExpr) {
        var code = compileExprSource.expr(interpExpr.expr);


        each(interpExpr.filters, function (filter) {
            code = 'componentCtx.callFilter("' + filter.name.paths[0].value + '", [' + code;
            each(filter.args, function (arg) {
                code += ', ' + compileExprSource.expr(arg);
            });
            code += '])';
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
        switch (expr.type) {
            case ExprType.UNARY:
                return '!' + compileExprSource.expr(expr.expr);

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
        }
    }
};
// #[end]

exports = module.exports = compileExprSource;
