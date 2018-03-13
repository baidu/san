/**
 * @file 判断 text aNode 的内容是否简单文本
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var ExprType = require('../parser/expr-type');

/**
 * 判断 text aNode 的内容是否简单文本
 *
 * @param {Object} aNode 要判断的text aNode
 * @return {boolean}
 */
function isSimpleText(aNode) {
    var segs = aNode.textExpr.segs;
    var len = segs.length;

    while (len--) {
        var seg = segs[len];

        if (seg.type === ExprType.INTERP && seg.raw) {
            return false;
        }
    }

    return true;
}

exports = module.exports = isSimpleText;
