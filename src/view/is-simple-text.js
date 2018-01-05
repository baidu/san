/**
 * @file 判断 text aNode 的内容是否简单文本
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 判断 text aNode 的内容是否简单文本
 *
 * @param {Object} aNode 要判断的text aNode
 * @return {boolean}
 */
function isSimpleText(aNode) {
    var isSimple = true;

    each(aNode.textExpr.segs, function (seg) {
        if (seg.type === ExprType.INTERP) {
            each(seg.filters, function (filter) {
                switch (filter.name) {
                    case 'html':
                    case 'url':
                        return;
                }

                isSimple = false;
                return isSimple;
            });
        }

        return isSimple;
    });

    return isSimple;
}

exports = module.exports = isSimpleText;
