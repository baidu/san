/**
 * @file 分析表达式的依赖
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var IndexedList = require('../util/indexed-list');

/**
 * 分析表达式的依赖
 *
 * @param {Object} expr 要分析的目标表达式
 * @return {IndexedList}
 */
function analyseExprDep(expr) {
    var deps = new IndexedList();

    switch (expr.type) {
        case ExprType.ACCESSOR:
            var paths = expr.paths;
            var len = paths.length;

            if (paths.length === 1) {
                deps.push({name: paths[0].value});
            }
            else if (!paths[1].value) {
                deps.push({ name: paths[0].value + '.*'});
            }
            else {
                deps.push({ name: paths[0].value + '.' + paths[1].value});
            }

            break;

        case ExprType.UNARY:
            return analyseDep(expr.expr);

        case ExprType.TEXT:
        case ExprType.BINARY:
        case ExprType.TERTIARY:
            each(expr.segs, function (seg) {
                dep = dep.concat(analyseDep(seg));
            });
            break;

        case ExprType.INTERP:
            dep = analyseDep(expr.expr);
            each(expr.filters, function (filter) {
                dep = dep.concat(analyseDep(expr.name));
                each(filter.args, function (arg) {
                    dep = dep.concat(analyseDep(arg));
                });
            });
            break;

    }

    return deps;
}

exports = module.exports = analyseExprDep;
