/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 解析组件的模板
 */

var warn = require('../util/warn');
var parseTemplate = require('../parser/parse-template');
var ExprType = require('../parser/expr-type');
var createAccessor = require('../parser/create-accessor');



/**
 * 解析组件的模板
 *
 * @param {Function} ComponentClass 组件类
 * @return {ANode}
 */
function parseComponentTemplate(ComponentClass, tplANode) {
    var proto = ComponentClass.prototype;
    var aNode;

    if (!tplANode) {
        tplANode = parseTemplate(ComponentClass.template || proto.template, {
            trimWhitespace: proto.trimWhitespace || ComponentClass.trimWhitespace,
            delimiters: proto.delimiters || ComponentClass.delimiters
        });
        aNode = tplANode.children[0];
    } else {
        aNode = tplANode;
    }
    if (aNode && aNode.textExpr) {
        aNode = null;
    }

    // #[begin] error
    if (tplANode.children.length !== 1 || !aNode) {
        warn('Component template must have a root element.');
    }
    // #[end]

    aNode = aNode || {
        directives: {},
        props: [],
        events: [],
        children: []
    };

    if (aNode.tagName === 'template') {
        delete aNode.tagName;
    }

    if (proto.autoFillStyleAndId !== false && ComponentClass.autoFillStyleAndId !== false) {
        var extraPropExists = {};

        var len = aNode.props.length;
        while (len--) {
            var prop = aNode.props[len];
            switch (prop.name) {
                case 'class':
                case 'style':
                    extraPropExists[prop.name] = true;
                    prop.expr = {
                        type: ExprType.INTERP,
                        expr: createAccessor([{
                            type: ExprType.STRING,
                            value: prop.name
                        }]),
                        filters: [{
                            type: ExprType.CALL,
                            args: [prop.expr],
                            name: createAccessor([{
                                type: ExprType.STRING,
                                value: '_x' + prop.name
                            }])
                        }]
                    }
                    break;

                case 'id':
                    extraPropExists[prop.name] = true;
                
            }
        }

        if (!extraPropExists['class']) {
            aNode.props.push({
                name: 'class',
                expr: {
                    type: ExprType.INTERP,
                    expr: createAccessor([{
                        type: ExprType.STRING,
                        value: 'class'
                    }]),
                    filters: [{
                        type: ExprType.CALL,
                        args: [],
                        name: createAccessor([{
                            type: ExprType.STRING,
                            value: '_class'
                        }])
                    }]
                }
            });
        }

        if (!extraPropExists.style) {
            aNode.props.push({
                name: 'style',
                expr: {
                    type: ExprType.INTERP,
                    expr: createAccessor([{
                        type: ExprType.STRING,
                        value: 'style'
                    }]),
                    filters: [{
                        type: ExprType.CALL,
                        args: [],
                        name: createAccessor([{
                            type: ExprType.STRING,
                            value: '_style'
                        }])
                    }]
                }
            });
        }

        if (!extraPropExists.id) {
            aNode.props.push({ 
                name: 'id', 
                expr: createAccessor([{
                    type: ExprType.STRING,
                    value: 'id'
                }])
            });
        }
    }

    return aNode;
}

exports = module.exports = parseComponentTemplate;
