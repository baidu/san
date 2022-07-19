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



/**
 * 解析组件的模板
 *
 * @param {Function} ComponentClass 组件类
 * @return {ANode}
 */
function parseComponentTemplate(ComponentClass) {
    var proto = ComponentClass.prototype;

    
    var tplANode = parseTemplate(ComponentClass.template || proto.template, {
        trimWhitespace: proto.trimWhitespace || ComponentClass.trimWhitespace,
        delimiters: proto.delimiters || ComponentClass.delimiters
    });

    var aNode = tplANode.children[0];
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
        fillStyleAndId(aNode.props);

        if (aNode.elses) {
            for (var i = 0, l = aNode.elses.length; i < l; i++) {
                fillStyleAndId(aNode.elses[i].props);
            }
        }
    }

    return aNode;
}

/**
 * 为组件 ANode 填充 props：class、style、id
 * 
 * @param {Array} props ANode 属性列表
 */
function fillStyleAndId(props) {
    var extraPropExists = {};

    var len = props.length;
    while (len--) {
        var prop = props[len];
        switch (prop.name) {
            case 'class':
            case 'style':
                extraPropExists[prop.name] = true;
                prop.expr = {
                    type: ExprType.INTERP,
                    expr: {
                        type: ExprType.ACCESSOR,
                        paths: [
                            {type: ExprType.STRING, value: prop.name}
                        ]
                    },
                    filters: [{
                        type: ExprType.CALL,
                        args: [prop.expr],
                        name: {
                            type: ExprType.ACCESSOR,
                            paths: [
                                {type: ExprType.STRING, value: '_x' + prop.name}
                            ]
                        }
                    }]
                }
                break;

            case 'id':
                extraPropExists[prop.name] = true;

        }
    }

    if (!extraPropExists['class']) {
        props.push({
            name: 'class',
            expr: {
                type: ExprType.INTERP,
                expr: {
                    type: ExprType.ACCESSOR,
                    paths: [
                        {type: ExprType.STRING, value: 'class'}
                    ]
                },
                filters: [{
                    type: ExprType.CALL,
                    args: [],
                    name: {
                        type: ExprType.ACCESSOR,
                        paths: [
                            {type: ExprType.STRING, value: '_class'}
                        ]
                    }
                }]
            }
        });
    }

    if (!extraPropExists.style) {
        props.push({
            name: 'style',
            expr: {
                type: ExprType.INTERP,
                expr: {
                    type: ExprType.ACCESSOR,
                    paths: [
                        {type: ExprType.STRING, value: 'style'}
                    ]
                },
                filters: [{
                    type: ExprType.CALL,
                    args: [],
                    name: {
                        type: ExprType.ACCESSOR,
                        paths: [
                            {type: ExprType.STRING, value: '_style'}
                        ]
                    }
                }]
            }
        });
    }

    if (!extraPropExists.id) {
        props.push({
            name: 'id',
            expr: {
                type: ExprType.ACCESSOR,
                paths: [
                    {type: ExprType.STRING, value: 'id'}
                ]
            }
        });
    }
}

exports = module.exports = parseComponentTemplate;
