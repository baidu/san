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
            delete firstChild.tagName;
        }

        if (proto.autoFillStyleAndId !== false && ComponentClass.autoFillStyleAndId !== false) {
            var extraPropExists = {};

            var len = firstChild.props.length;
            while (len--) {
                var prop = firstChild.props[len];
                switch (prop.name) {
                    case 'class':
                    case 'style':
                        extraPropExists[prop.name] = true;
                        var propExpr = parseText('{{' + prop.name + '|_x' + prop.name + '}}').segs[0];
                        propExpr.filters[0].args.push(prop.expr);
                        prop.expr = propExpr;
                        break;

                    case 'id':
                        extraPropExists[prop.name] = true;
                    
                }
            }

            if (!extraPropExists['class']) {
                firstChild.props.push({
                    name: 'class',
                    expr: parseText('{{class | _class}}')
                });
            }

            if (!extraPropExists.style) {
                firstChild.props.push({
                    name: 'style',
                    expr: parseText('{{style | _style}}')
                });
            }

            if (!extraPropExists.id) {
                firstChild.props.push({ name: 'id', expr: parseExpr('id') });
            }
        }
    }
}

exports = module.exports = compileComponent;
