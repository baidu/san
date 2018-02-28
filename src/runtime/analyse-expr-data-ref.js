/**
 * @file 分析表达式的数据引用
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('../parser/expr-type');
var each = require('../util/each');

/**
 * 分析表达式的数据引用
 *
 * @param {Object} expr 要分析的表达式
 * @return {Array}
 */
function analyseExprDataRef(expr) {
    var dataRefs = [];

    switch (expr.type) {
        case ExprType.ACCESSOR:
            var paths = expr.paths;
            dataRefs.push(paths[0].value);

            if (paths.length > 1) {
                if (!paths[1].value) {
                    dataRefs.push(paths[0].value + '.*');
                }
                else {
                    dataRefs.push(paths[0].value + '.' + paths[1].value);
                }
            }

            each(paths, function (path, index) {
                if (index) {
                    dataRefs = dataRefs.concat(analyseExprDataRef(path));
                }
            });

            break;

        case ExprType.UNARY:
            return analyseExprDataRef(expr.expr);

        case ExprType.TEXT:
        case ExprType.BINARY:
        case ExprType.TERTIARY:
            each(expr.segs, function (seg) {
                dataRefs = dataRefs.concat(analyseExprDataRef(seg));
            });
            break;

        case ExprType.INTERP:
            dataRefs = analyseExprDataRef(expr.expr);

            each(expr.filters, function (filter) {
                each(filter.name.paths, function (path) {
                    dataRefs = dataRefs.concat(analyseExprDataRef(path));
                });


                each(filter.args, function (arg) {
                    dataRefs = dataRefs.concat(analyseExprDataRef(arg));
                });
            });

            break;

    }

    return dataRefs;
}

exports = module.exports = analyseExprDataRef;
