/**
 * @file 在对象上使用accessor表达式查找方法
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var evalExpr = require('../runtime/eval-expr');

/**
 * 在对象上使用accessor表达式查找方法
 *
 * @param {Object} source 源对象
 * @param {Object} nameExpr 表达式
 * @param {Data} data 所属数据环境
 * @return {Function}
 */
function findMethod(source, nameExpr, data) {
    var method = source;
    each(nameExpr.paths, function (pathExpr) {
        method = method[evalExpr(pathExpr, data)];
        return method != null;
    });

    return method;
}

exports = module.exports = findMethod;
