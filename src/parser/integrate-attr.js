/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析抽象节点属性
 */

var kebab2camel = require('../util/kebab2camel');
var boolAttrs = require('../browser/bool-attrs');
var ExprType = require('./expr-type');
var parseExpr = require('./parse-expr');
var parseCall = require('./parse-call');
var parseText = require('./parse-text');
var parseDirective = require('./parse-directive');


/**
 * 解析抽象节点属性
 *
 * @param {ANode} aNode 抽象节点
 * @param {string} name 属性名称
 * @param {string} value 属性值
 * @param {Object} options 解析参数
 * @param {Array?} options.delimiters 插值分隔符列表
 */
function integrateAttr(aNode, name, value, options) {
    var prefixIndex = name.indexOf('-');
    var realName;
    var prefix;

    if (prefixIndex > 0) {
        prefix = name.slice(0, prefixIndex);
        realName = name.slice(prefixIndex + 1);
    }

    switch (prefix) {
        case 'on':
            var event = {
                name: realName,
                modifier: {}
            };
            aNode.events.push(event);

            var colonIndex;
            while ((colonIndex = value.indexOf(':')) > 0) {
                var modifier = value.slice(0, colonIndex);

                // eventHandler("dd:aa") 这种情况不能算modifier，需要辨识
                if (!/^[a-z]+$/i.test(modifier)) {
                    break;
                }

                event.modifier[modifier] = true;
                value = value.slice(colonIndex + 1);
            }

            event.expr = parseCall(value, [
                {
                    type: ExprType.ACCESSOR,
                    paths: [
                        {type: ExprType.STRING, value: '$event'}
                    ]
                }
            ]);
            break;

        case 'san':
        case 's':
            if (realName === 'else-if') {
                realName = 'elif';
            }
            var directiveValue = parseDirective(realName, value, options);
            directiveValue && (aNode.directives[realName] = directiveValue);
            break;

        case 'var':
            if (!aNode.vars) {
                aNode.vars = [];
            }

            aNode.vars.push({
                name: kebab2camel(realName),
                expr: parseExpr(value.replace(/(^\{\{|\}\}$)/g, ''))
            });
            break;

        default:
            var propsArray = aNode.props;
            if (prefix === 'prop') {
                name = realName;
            }

            if (prefix === 'attr') {
                name = realName;
                if (!aNode.attrs) {
                    aNode.attrs = [];
                }
                propsArray = aNode.attrs;
            }

            // parse two way binding, e.g. value="{=ident=}"
            if (value && value.indexOf('{=') === 0 && value.slice(-2) === '=}') {
                propsArray.push({
                    name: name,
                    expr: parseExpr(value.slice(2, -2)),
                    x: 1
                });

                return;
            }

            var expr = parseText(value || '', options.delimiters);
            if (expr.value === '') {
                if (boolAttrs[name]) {
                    expr = {
                        type: ExprType.BOOL,
                        value: true
                    };
                }
            }
            else {
                switch (name) {
                    case 'class':
                    case 'style':

                        switch (expr.type) {
                            case ExprType.TEXT:
                                for (var i = 0, l = expr.segs.length; i < l; i++) {
                                    if (expr.segs[i].type === ExprType.INTERP) {
                                        expr.segs[i].filters.push({
                                            type: ExprType.CALL,
                                            name: {
                                                type: ExprType.ACCESSOR,
                                                paths: [
                                                    {type: ExprType.STRING, value: '_' + name}
                                                ]
                                            },
                                            args: []
                                        });
                                    }
                                }
                                break;

                            case ExprType.INTERP:
                                expr.filters.push({
                                    type: ExprType.CALL,
                                    name: {
                                        type: ExprType.ACCESSOR,
                                        paths: [
                                            {type: ExprType.STRING, value: '_' + name}
                                        ]
                                    },
                                    args: []
                                });
                                break;

                            default:
                                if (expr.type !== ExprType.STRING) {
                                    expr = {
                                        type: ExprType.INTERP,
                                        expr: expr,
                                        filters: [{
                                            type: ExprType.CALL,
                                            name: {
                                                type: ExprType.ACCESSOR,
                                                paths: [
                                                    {type: ExprType.STRING, value: '_' + name}
                                                ]
                                            },
                                            args: []
                                        }]
                                    }
                                }
                        }
                }

            }

            propsArray.push(
                value != null
                    ? {name: name, expr: expr}
                    : {name: name, expr: expr, noValue: 1}
            );
    }
}


exports = module.exports = integrateAttr;
