/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析抽象节点属性
 */

var each = require('../util/each');
var kebab2camel = require('../util/kebab2camel');
var boolAttrs = require('../browser/bool-attrs');
var ExprType = require('./expr-type');
var createAccessor = require('./create-accessor');
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
                createAccessor([
                    {type: ExprType.STRING, value: '$event'}
                ])
            ]);
            break;

        case 'san':
        case 's':
            parseDirective(aNode, realName, value, options);
            break;

        case 'prop':
            integrateProp(aNode, realName, value, options);
            break;

        case 'var':
            if (!aNode.vars) {
                aNode.vars = [];
            }

            realName = kebab2camel(realName);
            aNode.vars.push({
                name: realName,
                expr: parseExpr(value.replace(/(^\{\{|\}\}$)/g, ''))
            });
            break;

        default:
            integrateProp(aNode, name, value, options);
    }
}

/**
 * 解析抽象节点绑定属性
 *
 * @inner
 * @param {ANode} aNode 抽象节点
 * @param {string} name 属性名称
 * @param {string} rawValue 属性值
 * @param {Object} options 解析参数
 * @param {Array?} options.delimiters 插值分隔符列表
 */
function integrateProp(aNode, name, rawValue, options) {
    // parse two way binding, e.g. value="{=ident=}"
    if (rawValue && rawValue.indexOf('{=') === 0 && rawValue.slice(-2) === '=}') {
        aNode.props.push({
            name: name,
            expr: parseExpr(rawValue.slice(2, -2)),
            x: 1
        });

        return;
    }

    var expr = parseText(rawValue || '', options.delimiters);

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
                                    name: createAccessor([
                                        {
                                            type: ExprType.STRING,
                                            value: '_' + name
                                        }
                                    ]),
                                    args: []
                                });
                            }
                        }
                        break;

                    case ExprType.INTERP:
                        expr.filters.push({
                            type: ExprType.CALL,
                            name: createAccessor([
                                {
                                    type: ExprType.STRING,
                                    value: '_' + name
                                }
                            ]),
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
                                    name: createAccessor([
                                        {
                                            type: ExprType.STRING,
                                            value: '_' + name
                                        }
                                    ]),
                                    args: []
                                }]
                            }
                        }
                }
        }

    }

    aNode.props.push(
        rawValue != null
            ? {name: name, expr: expr}
            : {name: name, expr: expr, noValue: 1}
    );
}


exports = module.exports = integrateAttr;
