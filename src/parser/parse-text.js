/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析文本
 */

var Walker = require('./walker');
var readTertiaryExpr = require('./read-tertiary-expr');
var ExprType = require('./expr-type');
var readCall = require('./read-call');
var decodeHTMLEntity = require('../util/decode-html-entity');


/**
 * 解析文本
 *
 * @param {string} source 源码
 * @param {Array?} delimiters 分隔符。默认为 ['{{', '}}']
 * @return {Object}
 */
function parseText(source, delimiters) {
    delimiters = delimiters || ['{{', '}}'];

    var walker = new Walker(source);
    var beforeIndex = 0;

    var segs = [];
    var original;

    var delimStart = delimiters[0];
    var delimStartLen = delimStart.length;
    var delimEnd = delimiters[1];
    var delimEndLen = delimEnd.length;
    while (1) {
        var delimStartIndex = walker.source.indexOf(delimStart, walker.index);
        var delimEndIndex = walker.source.indexOf(delimEnd, walker.index);
        if (delimStartIndex === -1 || delimEndIndex < delimStartIndex) {
            break;
        }

        // pushStringToSeg
        var strValue = walker.source.slice(
            beforeIndex,
            delimStartIndex
        );
        strValue && segs.push({
            type: ExprType.STRING,
            value: decodeHTMLEntity(strValue)
        });

        // pushInterpToSeg
        if (walker.source.indexOf(delimEnd, delimEndIndex + 1) === delimEndIndex + 1) {
            delimEndIndex++;
        }
        walker.index = delimStartIndex + delimStartLen;
        var interp = readInterp(walker);
        original = original || interp.original;
        segs.push(interp);

        beforeIndex = walker.index = delimEndIndex + delimEndLen;
    }

    // pushStringToSeg
    var strValue = walker.source.slice(beforeIndex);
    strValue && segs.push({
        type: ExprType.STRING,
        value: decodeHTMLEntity(strValue)
    });

    switch (segs.length) {
        case 0:
            return {
                type: ExprType.STRING,
                value: ''
            };

        case 1:
            if (segs[0].type === ExprType.INTERP && segs[0].filters.length === 0 && !segs[0].original) {
                return segs[0].expr;
            }
            return segs[0];
    }

    return original ? {
        type: ExprType.TEXT,
        segs: segs,
        original: 1
    } : {
        type: ExprType.TEXT,
        segs: segs
    };
}

/**
 * 读取插值替换
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readInterp(walker) {
    var interp = {
        type: ExprType.INTERP,
        expr: readTertiaryExpr(walker),
        filters: []
    };

    while (walker.goUntil(124)) { // |
        var callExpr = readCall(walker, []);
        switch (callExpr.name.paths[0].value) {
            case 'html':
                break;
            case 'raw':
                interp.original = 1;
                break;
            default:
                interp.filters.push(callExpr);
        }
    }

    return interp;
}

exports = module.exports = parseText;
