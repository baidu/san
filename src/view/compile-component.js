/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 编译组件类
 */

var warn = require('../util/warn');
var parseTemplate = require('../parser/parse-template');
var parseText = require('../parser/parse-text');


/**
 * 编译组件类。预解析template和components
 *
 * @param {Function} ComponentClass 组件类
 */
function compileComponent(ComponentClass) {
    var proto = ComponentClass.prototype;

    // pre compile template
    /* istanbul ignore else  */
    if (!proto.hasOwnProperty('aNode')) {
        var aNode = parseTemplate(ComponentClass.template || proto.template, {
            trimWhitespace: proto.trimWhitespace || ComponentClass.trimWhitespace,
            delimiters: proto.delimiters || ComponentClass.delimiters
        });

        var firstChild = aNode.children[0];
        if (firstChild && firstChild.textExpr) {
            firstChild = null;
        }

        // #[begin] error
        if (aNode.children.length !== 1 || !firstChild) {
            warn('Component template must have a root element.');
        }
        // #[end]

        proto.aNode = firstChild = firstChild || {
            directives: {},
            props: [],
            events: [],
            children: []
        };

        if (firstChild.tagName === 'template') {
            firstChild.tagName = null;
        }

        if (proto.autoFillStyleAndId !== false && ComponentClass.autoFillStyleAndId !== false) {
            var toExtraProp = {
                'class': 0, style: 0, id: 0
            };

            var len = firstChild.props.length;
            while (len--) {
                var prop = firstChild.props[len];
                if (toExtraProp[prop.name] != null) {
                    toExtraProp[prop.name] = prop;
                    firstChild.props.splice(len, 1);
                }
            }

            toExtraProp.id = toExtraProp.id || { name: 'id', expr: parseExpr('id'), raw: 'id' };

            if (toExtraProp['class']) {
                var classExpr = parseText('{{class | _xclass}}').segs[0];
                classExpr.filters[0].args.push(toExtraProp['class'].expr);
                toExtraProp['class'].expr = classExpr;
            }
            else {
                toExtraProp['class'] = {
                    name: 'class',
                    expr: parseText('{{class | _class}}'),
                    raw: '{{class | _class}}'
                };
            }

            if (toExtraProp.style) {
                var styleExpr = parseText('{{style | _xstyle}}').segs[0];
                styleExpr.filters[0].args.push(toExtraProp.style.expr);
                toExtraProp.style.expr = styleExpr;
            }
            else {
                toExtraProp.style = {
                    name: 'style',
                    expr: parseText('{{style | _style}}'),
                    raw: '{{style | _style}}'
                };
            }

            firstChild.props.push(
                toExtraProp['class'], // eslint-disable-line dot-notation
                toExtraProp.style,
                toExtraProp.id
            );
        }
    }
}

exports = module.exports = compileComponent;
