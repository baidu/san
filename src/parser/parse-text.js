/**
 * @file 解析文本
 * @author errorrik(errorrik@gmail.com)
 */

var Walker = require('./walker');
var ExprType = require('./expr-type');
var parseInterp = require('./parse-interp');

/**
 * 解析文本
 *
 * @param {string} source 源码
 * @return {Object}
 */
function parseText(source) {
    var exprStartReg = /\{\{\s*([\s\S]+?)\s*\}\}/ig;
    var exprMatch;

    var walker = new Walker(source);
    var beforeIndex = 0;

    var segs = [];
    function pushStringToSeg(text) {
        text && segs.push({
            type: ExprType.STRING,
            value: text
        });
    }

    while ((exprMatch = walker.match(exprStartReg)) != null) {
        pushStringToSeg(walker.cut(
            beforeIndex,
            walker.index - exprMatch[0].length
        ));
        segs.push(parseInterp(exprMatch[1]));
        beforeIndex = walker.index;
    }

    pushStringToSeg(walker.cut(beforeIndex));

    var expr = {
        type: ExprType.TEXT,
        segs: segs
    };

    if (segs.length === 1 && segs[0].type === ExprType.STRING) {
        expr.value = segs[0].value;
    }

    return expr;
}

exports = module.exports = parseText;
