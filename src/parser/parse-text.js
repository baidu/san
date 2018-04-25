/**
 * @file 解析文本
 * @author errorrik(errorrik@gmail.com)
 */

var Walker = require('./walker');
var ExprType = require('./expr-type');
var parseInterp = require('./parse-interp');
var decodeHTMLEntity = require('../util/decode-html-entity');

/**
 * 对字符串进行可用于new RegExp的字面化
 *
 * @inner
 * @param {string} source 需要字面化的字符串
 * @return {string} 字符串字面化结果
 */
function regexpLiteral(source) {
    return source.replace(/[\^\[\]\$\(\)\{\}\?\*\.\+\\]/g, function (c) {
        return '\\' + c;
    });
}

/**
 * 解析文本
 *
 * @param {string} source 源码
 * @param {Array?} delimiters 分隔符。默认为 ['{{', '}}']
 * @return {Object}
 */
function parseText(source, delimiters) {
    delimiters = delimiters || ['{{', '}}'];
    var exprStartReg = new RegExp(
        regexpLiteral(delimiters[0]) + '\\s*([\\s\\S]+?)\\s*' + regexpLiteral(delimiters[1]),
        'ig'
    );

    var exprMatch;

    var walker = new Walker(source);
    var beforeIndex = 0;

    var expr = {
        type: ExprType.TEXT,
        segs: []
    };

    function pushStringToSeg(text) {
        text && expr.segs.push({
            type: ExprType.STRING,
            literal: text,
            value: decodeHTMLEntity(text)
        });
    }

    while ((exprMatch = walker.match(exprStartReg)) != null) {
        pushStringToSeg(walker.cut(
            beforeIndex,
            walker.index - exprMatch[0].length
        ));

        var interp = parseInterp(exprMatch[1]);
        expr.original = expr.original || interp.original;

        expr.segs.push(interp);
        beforeIndex = walker.index;
    }

    pushStringToSeg(walker.cut(beforeIndex));



    if (expr.segs.length === 1 && expr.segs[0].type === ExprType.STRING) {
        expr.value = expr.segs[0].value;
    }

    return expr;
}

exports = module.exports = parseText;
