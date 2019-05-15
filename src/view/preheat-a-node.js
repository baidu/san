/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file ANode预热
 */

var ExprType = require('../parser/expr-type');
var each = require('../util/each');
var extend = require('../util/extend');
var createEl = require('../browser/create-el');
var getPropHandler = require('./get-prop-handler');
var getANodeProp = require('./get-a-node-prop');
var isBrowser = require('../browser/is-browser');
var TextNode = require('./text-node');
var SlotNode = require('./slot-node');
var ForNode = require('./for-node');
var IfNode = require('./if-node');
var TemplateNode = require('./template-node');

/**
 * ANode预热，分析的数据引用等信息
 *
 * @param {Object} aNode 要预热的ANode
 */
function preheatANode(aNode) {
    var stack = [];

    function recordHotspotData(expr, notContentData) {
        var refs = analyseExprDataHotspot(expr);

        if (refs.length) {
            for (var i = 0, len = stack.length; i < len; i++) {
                if (!notContentData || i !== len - 1) {
                    var data = stack[i].hotspot.data;
                    if (!data) {
                        data = stack[i].hotspot.data = {};
                    }

                    each(refs, function (ref) {
                        data[ref] = 1;
                    });
                }
            }
        }
    }


    function analyseANodeHotspot(aNode) {
        if (!aNode.hotspot) {
            stack.push(aNode);


            if (aNode.textExpr) {
                aNode.hotspot = {};
                aNode.Clazz = TextNode;
                recordHotspotData(aNode.textExpr);
            }
            else {
                var sourceNode;
                if (isBrowser && aNode.tagName
                    && aNode.tagName.indexOf('-') < 0
                    && !/^(template|slot|select|input|option|button|video|audio|canvas|img|embed|object|iframe)$/i.test(aNode.tagName)
                ) {
                    sourceNode = createEl(aNode.tagName);
                }

                aNode.hotspot = {
                    dynamicProps: [],
                    xProps: [],
                    props: {},
                    sourceNode: sourceNode
                };


                // === analyse hotspot data: start
                each(aNode.vars, function (varItem) {
                    recordHotspotData(varItem.expr);
                });

                each(aNode.props, function (prop) {
                    recordHotspotData(prop.expr);
                });

                for (var key in aNode.directives) {
                    /* istanbul ignore else  */
                    if (aNode.directives.hasOwnProperty(key)) {
                        var directive = aNode.directives[key];
                        recordHotspotData(
                            directive.value,
                            !/^(html|bind)$/.test(key)
                        );

                        // init trackBy getKey function
                        if (key === 'for') {
                            var trackBy = directive.trackBy;
                            if (trackBy
                                && trackBy.type === ExprType.ACCESSOR
                                && trackBy.paths[0].value === directive.item
                            ) {
                                aNode.hotspot.getForKey = new Function(
                                    directive.item,
                                    'return ' + trackBy.raw
                                );
                            }
                        }
                    }
                }

                each(aNode.elses, function (child) {
                    analyseANodeHotspot(child);
                });

                each(aNode.children, function (child) {
                    analyseANodeHotspot(child);
                });
                // === analyse hotspot data: end


                // === analyse hotspot props: start
                each(aNode.props, function (prop, index) {
                    aNode.hotspot.props[prop.name] = index;
                    prop.handler = getPropHandler(aNode.tagName, prop.name);

                    if (prop.name === 'id') {
                        prop.id = true;
                        aNode.hotspot.idProp = prop;
                        aNode.hotspot.dynamicProps.push(prop);
                    }
                    else if (prop.expr.value != null) {
                        if (sourceNode) {
                            prop.handler(sourceNode, prop.expr.value, prop.name, aNode);
                        }
                    }
                    else {
                        if (prop.x) {
                            aNode.hotspot.xProps.push(prop);
                        }
                        aNode.hotspot.dynamicProps.push(prop);
                    }
                });

                // ie 下，如果 option 没有 value 属性，select.value = xx 操作不会选中 option
                // 所以没有设置 value 时，默认把 option 的内容作为 value
                if (aNode.tagName === 'option'
                    && !getANodeProp(aNode, 'value')
                    && aNode.children[0]
                ) {
                    var valueProp = {
                        name: 'value',
                        expr: aNode.children[0].textExpr,
                        handler: getPropHandler(aNode.tagName, 'value')
                    };
                    aNode.props.push(valueProp);
                    aNode.hotspot.dynamicProps.push(valueProp);
                    aNode.hotspot.props.value = aNode.props.length - 1;
                }

                if (aNode.directives['if']) { // eslint-disable-line dot-notation
                    aNode.ifRinsed = {
                        children: aNode.children,
                        props: aNode.props,
                        events: aNode.events,
                        tagName: aNode.tagName,
                        vars: aNode.vars,
                        hotspot: aNode.hotspot,
                        directives: extend({}, aNode.directives)
                    };
                    aNode.Clazz = IfNode;
                    aNode = aNode.ifRinsed;
                    aNode.directives['if'] = null; // eslint-disable-line dot-notation
                }

                if (aNode.directives['for']) { // eslint-disable-line dot-notation
                    aNode.forRinsed = {
                        children: aNode.children,
                        props: aNode.props,
                        events: aNode.events,
                        tagName: aNode.tagName,
                        vars: aNode.vars,
                        hotspot: aNode.hotspot,
                        directives: extend({}, aNode.directives)
                    };
                    aNode.Clazz = ForNode;
                    aNode.forRinsed.directives['for'] = null; // eslint-disable-line dot-notation
                    aNode = aNode.forRinsed;
                }

                switch (aNode.tagName) {
                    case 'slot':
                        aNode.Clazz = SlotNode;
                        break;

                    case 'template':
                        aNode.Clazz = TemplateNode;
                }
                // === analyse hotspot props: end
            }

            stack.pop();
        }
    }

    if (aNode) {
        analyseANodeHotspot(aNode);
    }
}

/**
 * 分析表达式的数据引用
 *
 * @param {Object} expr 要分析的表达式
 * @return {Array}
 */
function analyseExprDataHotspot(expr, accessorMeanDynamic) {
    var refs = [];
    var isDynamic;

    function analyseExprs(exprs, accessorMeanDynamic) {
        for (var i = 0, l = exprs.length; i < l; i++) {
            refs = refs.concat(analyseExprDataHotspot(exprs[i], accessorMeanDynamic));
            isDynamic = isDynamic || exprs[i].dynamic;
        }
    }

    switch (expr.type) {
        case ExprType.ACCESSOR:
            isDynamic = accessorMeanDynamic;

            var paths = expr.paths;
            refs.push(paths[0].value);

            if (paths.length > 1) {
                refs.push(paths[0].value + '.' + (paths[1].value || '*'));
            }

            analyseExprs(paths.slice(1), 1);
            break;

        case ExprType.UNARY:
            refs = analyseExprDataHotspot(expr.expr, accessorMeanDynamic);
            isDynamic = expr.expr.dynamic;
            break;

        case ExprType.TEXT:
        case ExprType.BINARY:
        case ExprType.TERTIARY:
            analyseExprs(expr.segs, accessorMeanDynamic);
            break;

        case ExprType.INTERP:
            refs = analyseExprDataHotspot(expr.expr);
            isDynamic = expr.expr.dynamic;

            each(expr.filters, function (filter) {
                analyseExprs(filter.name.paths);
                analyseExprs(filter.args);
            });

            break;

        case ExprType.ARRAY:
        case ExprType.OBJECT:
            for (var i = 0; i < expr.items.length; i++) {
                refs = refs.concat(analyseExprDataHotspot(expr.items[i].expr));
                isDynamic = isDynamic || expr.items[i].expr.dynamic;
            }
            break;
    }

    isDynamic && (expr.dynamic = true);
    return refs;
}

exports = module.exports = preheatANode;
