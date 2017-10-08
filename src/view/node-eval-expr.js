/**
 * @file 在节点环境执行表达式
 * @author errorrik(errorrik@gmail.com)
 */

var evalExpr = require('../runtime/eval-expr');

/**
 * 在节点环境执行表达式
 *
 * @param {Object} node 节点对象
 * @param {Object} expr 表达式对象
 * @param {boolean} escapeInterpHtml 是否要对插值结果进行html转义
 * @return {*}
 */
function nodeEvalExpr(node, expr, escapeInterpHtml) {
    return evalExpr(expr, node.scope, node.owner, escapeInterpHtml);
}

exports = module.exports = nodeEvalExpr;
