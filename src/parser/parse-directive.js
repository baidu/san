/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析指令
 */


var Walker = require('./walker');
var parseExpr = require('./parse-expr');
var parseCall = require('./parse-call');
var parseText = require('./parse-text');
var readAccessor = require('./read-accessor');
var readUnaryExpr = require('./read-unary-expr');

/**
 * 解析指令
 *
 * @param {string} name 指令名称
 * @param {string} value 指令值
 * @param {Object} options 解析参数
 * @param {Array?} options.delimiters 插值分隔符列表
 */
function parseDirective(name, value, options) {
    switch (name) {
        case 'is':
        case 'show':
        case 'html':
        case 'bind':
        case 'if':
        case 'elif':
            return {
                value: parseExpr(value.replace(/(^\{\{|\}\}$)/g, ''))
            };

        case 'else':
            return {
                value: {}
            };
        
        case 'transition': 
            return {
                value: parseCall(value)
            };

        case 'ref':
            return {
                value: parseText(value, options.delimiters)
            };

        case 'for':
            var walker = new Walker(value);
            var match = walker.match(/^\s*([$0-9a-z_]+)(\s*,\s*([$0-9a-z_]+))?\s+in\s+/ig, 1);
    
            if (match) {
                var directive = {
                    item: match[1],
                    value: readUnaryExpr(walker)
                };
    
                if (match[3]) {
                    directive.index = match[3];
                }
    
                if (walker.match(/\s*trackby\s+/ig, 1)) {
                    var start = walker.index;
                    directive.trackBy = readAccessor(walker);
                    directive.trackByRaw = walker.source.slice(start, walker.index);
                }
                return directive;
            }
    
            // #[begin] error
            throw new Error('[SAN FATAL] for syntax error: ' + value);
            // #[end]
    }
}

exports = module.exports = parseDirective;
