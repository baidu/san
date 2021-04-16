/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析文本
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

var delimRegCache = {};

/**
 * 解析文本
 *
 * @param {string} source 源码
 * @param {Array?} delimiters 分隔符。默认为 ['{{', '}}']
 * @return {Object}
 */
function parseText(source, delimiters) {
    delimiters = delimiters || ['{{', '}}'];

    var regCacheKey = delimiters[0] + '>..<' + delimiters[1];
    var exprStartReg = delimRegCache[regCacheKey];
    if (!exprStartReg) {
        exprStartReg = new RegExp(
            regexpLiteral(delimiters[0])
                + '\\s*([\\s\\S]+?)\\s*'
                + regexpLiteral(delimiters[1]),
            'g'
        );
        delimRegCache[regCacheKey] = exprStartReg;
    }

    var exprMatch;

    var walker = new Walker(source);
    var beforeIndex = 0;

    var segs = [];
    var original;

    function pushStringToSeg(text) {
        text && segs.push({
            type: ExprType.STRING,
            value: decodeHTMLEntity(text)
        });
    }

    var delimEndLen = delimiters[1].length;
    while ((exprMatch = walker.match(exprStartReg)) != null) {
        var interpSource = exprMatch[1];
        var interpLen = exprMatch[0].length;
        if (walker.source.slice(walker.index + 1 - delimEndLen, walker.index + 1) === delimiters[1]) {
            interpSource += walker.source.slice(walker.index, walker.index + 1);
            walker.index++;
            interpLen++;
        }

        pushStringToSeg(walker.source.slice(
            beforeIndex,
            walker.index - interpLen
        ));

        var interp = parseInterp(interpSource);
        original = original || interp.original;
        segs.push(interp);

        beforeIndex = walker.index;
    }

    pushStringToSeg(walker.source.slice(beforeIndex));

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

exports = module.exports = parseText;
