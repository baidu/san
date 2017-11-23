/**
 * @file 解析指令
 * @author errorrik(errorrik@gmail.com)
 */


var Walker = require('./walker');
var parseExpr = require('./parse-expr');
var parseText = require('./parse-text');
var parseInterp = require('./parse-interp');
var readAccessor = require('./read-accessor');

/**
 * 指令解析器
 *
 * @inner
 * @type {Object}
 */
var directiveParsers = {
    'for': function (value) {
        var walker = new Walker(value);
        var match = walker.match(/^\s*([\$0-9a-z_]+)(\s*,\s*([\$0-9a-z_]+))?\s+in\s+/ig);

        if (match) {
            return {
                item: parseExpr(match[1]),
                index: parseExpr(match[3] || '$index'),
                list: readAccessor(walker)
            };
        }

        // #[begin] error
        throw new Error('[SAN FATAL] for syntax error: ' + value);
        // #[end]
    },

    'ref': function (value) {
        return {
            value: parseText(value)
        };
    },

    'if': function (value) {
        return {
            value: parseExpr(value.replace(/(^\{\{|\}\}$)/g, ''))
        };
    },

    'elif': function (value) {
        return {
            value: parseExpr(value.replace(/(^\{\{|\}\}$)/g, ''))
        };
    },

    'else': function (value) {
        return {
            value: 1
        };
    },

    'html': function (value) {
        return {
            value: parseInterp(value)
        };
    },

    'transition': function (value) {
        return {
            value: value
        };
    }
};

/**
 * 解析指令
 *
 * @param {ANode} aNode 抽象节点
 * @param {string} name 指令名称
 * @param {string} value 指令值
 */
function parseDirective(aNode, name, value) {
    var parser = directiveParsers[name];

    if (parser) {
        var result = parser(value);
        result.name = name;
        result.raw = value;

        aNode.directives.push(result);
    }
}

exports = module.exports = parseDirective;
