/**
 * @file 编译源码的 helper 方法集合
 * @author errorrik(errorrik@gmail.com)
 */
var ExprType = require('../parser/expr-type');

// #[begin] ssr

/**
 * 编译源码的 helper 方法集合对象
 */
var compileExprSource = {
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

    interp: function (interpExpr) {
        var code = compileExprSource.expr(interpExpr.expr);

        each(interpExpr.filters, function (filter) {
            code = 'componentCtx.callFilter("' + filter.name + '", [' + code;
            each(filter.args, function (arg) {
                code += ', ' + compileExprSource.expr(arg);
            });
            code += '])' ;
        });

        return code;
    },

    text: function (textExpr) {
        var code = '';

        each(textExpr.segs, function (seg) {
            if (seg.type === ExprType.INTERP && !seg.filters[0]) {
                seg = {
                    type: ExprType.INTERP,
                    expr: seg.expr,
                    filters:[
                        {
                            type: ExprType.CALL,
                            name: 'html',
                            args: []
                        }
                    ]
                };
            }

            var segCode = compileExprSource.expr(seg);
            if (code) {
                code += ' + ' + segCode;
            }
            else {
                code = segCode;
            }
        });

        return code;
    },

    expr: function (expr) {
        switch (expr.type) {
            case ExprType.UNARY:
                return ;

            case ExprType.BINARY:
                return ;

            case ExprType.TERTIARY:
                return ;

            case ExprType.STRING:
                return compileExprSource.stringLiteralize(expr.value);

            case ExprType.NUMBER:
                return expr.value;

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
