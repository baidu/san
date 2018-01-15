/**
 * @file 创建访问表达式对象
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('./expr-type');

/**
 * 创建访问表达式对象
 *
 * @param {Array} paths 访问路径
 * @return {Object}
 */
function createAccessor(paths) {
    return {
        type: ExprType.ACCESSOR,
        paths: paths
    };
}

exports = module.exports = createAccessor;
