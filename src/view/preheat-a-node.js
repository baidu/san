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
var kebab2camel = require('../util/kebab2camel');
var hotTags = require('../browser/hot-tags');
var createEl = require('../browser/create-el');
var getPropHandler = require('./get-prop-handler');
var getANodeProp = require('./get-a-node-prop');
var isBrowser = require('../browser/is-browser');
var TextNode = require('./text-node');
var SlotNode = require('./slot-node');
var ForNode = require('./for-node');
var IfNode = require('./if-node');
var IsNode = require('./is-node');
var TemplateNode = require('./template-node');
var Element = require('./element');

/**
 * ANode预热，分析的数据引用等信息
 *
 * @param {Object} aNode 要预热的ANode
 */
function preheatANode(aNode, componentInstance) {
    var stack = [];

    function recordHotspotData(expr, notContentData) {
        var refs = analyseExprDataHotspot(expr);
        var refsLen = refs.length;

        if (refsLen) {
            for (var i = 0, len = stack.length; i < len; i++) {
                if (!notContentData || i !== len - 1) {
                    var data = stack[i]._d; // hotspot: data
                    if (!data) {
                        data = stack[i]._d = {};
                    }

                    for (var j = 0; j < refsLen; j++) {
                        data[refs[j]] = 1;
                    }
                }
            }
        }
    }


    function analyseANodeHotspot(aNode) {
        if (!aNode._ht) {
            stack.push(aNode);


            if (aNode.textExpr) {
                aNode._ht = true;
                aNode.Clazz = TextNode;
                recordHotspotData(aNode.textExpr);
            }
            else {
                aNode._ht = true;
                aNode._i = 0; // hotspot: instance count
                aNode._dp = []; // hotspot: dynamic props
                aNode._xp = []; // hotspot: x props
                aNode._pi = {}; // hotspot: props index
                aNode._b = []; // hotspot: binds
                aNode._ce = !aNode.directives.is // cache element
                    && aNode.tagName && aNode.tagName.indexOf('-') < 0
                    && !/^(template|select|input|option|button|video|audio|canvas|img|embed|object|iframe)$/i.test(aNode.tagName);


                // === analyse hotspot data: start
                each(aNode.vars, function (varItem) {
                    recordHotspotData(varItem.expr);
                });

                var props = aNode.props;
                var propsLen = props.length;

                for (var i = 0; i < propsLen; i++) {
                    var prop = props[i];
                    aNode._b.push({
                        name: kebab2camel(prop.name),
                        expr: prop.noValue != null
                            ? {type: ExprType.BOOL, value: true}
                            : prop.expr,
                        x: prop.x,
                        noValue: prop.noValue
                    });
                    recordHotspotData(prop.expr);
                }

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
                                aNode._gfk = new Function( // hotspot: getForKey
                                    directive.item,
                                    'return ' + directive.trackByRaw
                                );
                            }
                        }
                    }
                }

                each(aNode.elses, function (child) {
                    analyseANodeHotspot(child);
                });

                for (var i = 0, l = aNode.children.length; i < l; i++) {
                    analyseANodeHotspot(aNode.children[i]);
                }
                // === analyse hotspot data: end


                // === analyse hotspot props: start
                for (var i = 0; i < propsLen; i++) {
                    var prop = props[i];
                    aNode._pi[prop.name] = i;
                    prop.handler = getPropHandler(aNode.tagName, prop.name);

                    if (prop.expr.value == null) {
                        if (prop.x) {
                            aNode._xp.push(prop);
                        }
                        aNode._dp.push(prop);
                    }
                }

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
                    aNode._dp.push(valueProp);
                    aNode._pi.value = props.length - 1;
                }

                if (aNode.directives['if']) { // eslint-disable-line dot-notation
                    aNode.ifRinsed = {
                        children: aNode.children,
                        props: props,
                        events: aNode.events,
                        tagName: aNode.tagName,
                        vars: aNode.vars,
                        directives: aNode.directives,
                        _ht: true,
                        _i: 0,
                        _d: aNode._d,
                        _dp: aNode._dp,
                        _xp: aNode._xp,
                        _pi: aNode._pi,
                        _b: aNode._b,
                        _ce: aNode._ce
                    };
                    aNode.hasRootNode = true;
                    aNode.Clazz = IfNode;
                    aNode = aNode.ifRinsed;
                }

                if (aNode.directives['for']) { // eslint-disable-line dot-notation
                    aNode.forRinsed = {
                        children: aNode.children,
                        props: props,
                        events: aNode.events,
                        tagName: aNode.tagName,
                        vars: aNode.vars,
                        directives: aNode.directives,
                        _ht: true,
                        _i: 0,
                        _d: aNode._d,
                        _dp: aNode._dp,
                        _xp: aNode._xp,
                        _pi: aNode._pi,
                        _b: aNode._b,
                        _ce: aNode._ce
                    };
                    aNode.hasRootNode = true;
                    aNode.Clazz = ForNode;
                    aNode = aNode.forRinsed;
                }

                if (aNode.directives.is) {
                    aNode.isRinsed = {
                        children: aNode.children,
                        props: props,
                        events: aNode.events,
                        tagName: aNode.tagName,
                        vars: aNode.vars,
                        directives: aNode.directives,
                        _ht: true,
                        _i: 0,
                        _d: aNode._d,
                        _dp: aNode._dp,
                        _xp: aNode._xp,
                        _pi: aNode._pi,
                        _b: aNode._b,
                        _ce: aNode._ce
                    };
                    aNode.hasRootNode = true;
                    aNode.Clazz = IsNode;
                    aNode = aNode.isRinsed;
                }

                switch (aNode.tagName) {
                    case 'slot':
                        aNode.Clazz = SlotNode;
                        break;

                    case 'template':
                    case 'fragment':
                        aNode.hasRootNode = true;
                        aNode.Clazz = TemplateNode;
                        break;

                    default:
                        if (!aNode.directives.is && hotTags[aNode.tagName]) {
                            if (!componentInstance || !componentInstance.components[aNode.tagName]) {
                                aNode.elem = true;
                            }

                            // #[begin] error
                            if (componentInstance && componentInstance.components[aNode.tagName]) {
                                warn('\`' + aNode.tagName + '\` as sub-component tag is a bad practice.');
                            }
                            // #[end]
                        }
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

        case ExprType.CALL:
            analyseExprs(expr.name.paths);
            analyseExprs(expr.args);
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
