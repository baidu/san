/**
 * @file 初始化节点的 s-bind 数据
 * @author errorrik(errorrik@gmail.com)
 */


var evalExpr = require('../runtime/eval-expr');

/**
 * 初始化节点的 s-bind 数据
 *
 * @param {Object} node 节点对象
 * @param {Object} sBind bind指令对象
 * @return {boolean}
 */
function nodeSBindInit(node, sBind) {
    if (sBind && node.scope) {
        node._sbindData = evalExpr(sBind.value, node.scope, node.owner);
        return true;
    }
}

exports = module.exports = nodeSBindInit;
