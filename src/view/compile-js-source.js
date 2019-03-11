/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将组件编译成 render 方法的 js 源码
 */


var each = require('../util/each');
var extend = require('../util/extend');
var splitStr2Obj = require('../util/split-str-2-obj');
var parseExpr = require('../parser/parse-expr');
var ExprType = require('../parser/expr-type');
var postProp = require('../parser/post-prop');
var autoCloseTags = require('../browser/auto-close-tags');
var camelComponentBinds = require('./camel-component-binds');
var CompileSourceBuffer = require('./compile-source-buffer');
var compileExprSource = require('./compile-expr-source');
var getANodeProp = require('./get-a-node-prop');
var ComponentLoader = require('./component-loader');

// #[begin] ssr

var ssrIndex = 0;
function genSSRId() {
    return '_id' + (ssrIndex++);
}

var stringifier = {
    obj: function (source) {
        var prefixComma;
        var result = '{';

        for (var key in source) {
            if (!source.hasOwnProperty(key) || typeof source[key] === 'undefined') {
                continue;
            }

            if (prefixComma) {
                result += ',';
            }
            prefixComma = 1;

            result += compileExprSource.stringLiteralize(key) + ':' + stringifier.any(source[key]);
        }

        return result + '}';
    },

    arr: function (source) {
        var prefixComma;
        var result = '[';

        each(source, function (value) {
            if (prefixComma) {
                result += ',';
            }
            prefixComma = 1;

            result += stringifier.any(value);
        });

        return result + ']';
    },

    str: function (source) {
        return compileExprSource.stringLiteralize(source);
    },

    date: function (source) {
        return 'new Date(' + source.getTime() + ')';
    },

    any: function (source) {
        switch (typeof source) {
            case 'string':
                return stringifier.str(source);

            case 'number':
                return '' + source;

            case 'boolean':
                return source ? 'true' : 'false';

            case 'object':
                if (!source) {
                    return null;
                }

                if (source instanceof Array) {
                    return stringifier.arr(source);
                }

                if (source instanceof Date) {
                    return stringifier.date(source);
                }

                return stringifier.obj(source);
        }

        throw new Error('Cannot Stringify:' + source);
    }
};

var COMPONENT_RESERVED_MEMBERS = splitStr2Obj('aNode,computed,filters,components,'
    + 'initData,template,attached,created,detached,disposed,compiled'
);

/**
 * 生成序列化时起始桩的html
 *
 * @param {string} type 桩类型标识
 * @param {string?} content 桩内的内容
 * @return {string}
 */
function serializeStump(type, content) {
    return '<!--s-' + type + (content ? ':' + content : '') + '-->';
}

/**
 * 生成序列化时结束桩的html
 *
 * @param {string} type 桩类型标识
 * @return {string}
 */
function serializeStumpEnd(type) {
    return '<!--/s-' + type + '-->';
}

/**
 * element 的编译方法集合对象
 *
 * @inner
 */
var elementSourceCompiler = {

    /* eslint-disable max-params */

    /**
     * 编译元素标签头
     *
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {ANode} aNode 抽象节点
     * @param {string=} tagNameVariable 组件标签为外部动态传入时的标签变量名
     */
    tagStart: function (sourceBuffer, aNode, tagNameVariable) {
        var props = aNode.props;
        var bindDirective = aNode.directives.bind;
        var tagName = aNode.tagName;

        if (tagName) {
            sourceBuffer.joinString('<' + tagName);
        }
        else if (tagNameVariable) {
            sourceBuffer.joinString('<');
            sourceBuffer.joinRaw(tagNameVariable + ' || "div"');
        }
        else {
            sourceBuffer.joinString('<div');
        }

        // index list
        var propsIndex = {};
        each(props, function (prop) {
            propsIndex[prop.name] = prop;

            if (prop.name !== 'slot' && prop.expr.value != null) {
                sourceBuffer.joinString(' ' + prop.name + '="' + prop.expr.segs[0].literal + '"');
            }
        });

        each(props, function (prop) {
            if (prop.name === 'slot' || prop.expr.value != null) {
                return;
            }

            if (prop.name === 'value') {
                switch (tagName) {
                    case 'textarea':
                        return;

                    case 'select':
                        sourceBuffer.addRaw('$selectValue = '
                            + compileExprSource.expr(prop.expr)
                            + ' || "";'
                        );
                        return;

                    case 'option':
                        sourceBuffer.addRaw('$optionValue = '
                            + compileExprSource.expr(prop.expr)
                            + ';'
                        );
                        // value
                        sourceBuffer.addRaw('if ($optionValue != null) {');
                        sourceBuffer.joinRaw('" value=\\"" + $optionValue + "\\""');
                        sourceBuffer.addRaw('}');

                        // selected
                        sourceBuffer.addRaw('if ($optionValue === $selectValue) {');
                        sourceBuffer.joinString(' selected');
                        sourceBuffer.addRaw('}');
                        return;
                }
            }

            switch (prop.name) {
                case 'readonly':
                case 'disabled':
                case 'multiple':
                    if (prop.raw === '') {
                        sourceBuffer.joinString(' ' + prop.name);
                    }
                    else {
                        sourceBuffer.joinRaw('boolAttrFilter("' + prop.name + '", '
                            + compileExprSource.expr(prop.expr)
                            + ')'
                        );
                    }
                    break;

                case 'checked':
                    if (tagName === 'input') {
                        var valueProp = propsIndex.value;
                        var valueCode = compileExprSource.expr(valueProp.expr);

                        if (valueProp) {
                            switch (propsIndex.type.raw) {
                                case 'checkbox':
                                    sourceBuffer.addRaw('if (contains('
                                        + compileExprSource.expr(prop.expr)
                                        + ', '
                                        + valueCode
                                        + ')) {'
                                    );
                                    sourceBuffer.joinString(' checked');
                                    sourceBuffer.addRaw('}');
                                    break;

                                case 'radio':
                                    sourceBuffer.addRaw('if ('
                                        + compileExprSource.expr(prop.expr)
                                        + ' === '
                                        + valueCode
                                        + ') {'
                                    );
                                    sourceBuffer.joinString(' checked');
                                    sourceBuffer.addRaw('}');
                                    break;
                            }
                        }
                    }
                    break;

                default:
                    var onlyOneAccessor = false;
                    var preCondExpr;

                    if (prop.expr.type === ExprType.ACCESSOR) {
                        onlyOneAccessor = true;
                        preCondExpr = prop.expr;
                    }
                    else if (prop.expr.segs.length === 1) {
                        var interpExpr = prop.expr.segs[0];
                        var interpFilters = interpExpr.filters;

                        if (!interpFilters.length
                            || interpFilters.length === 1 && interpFilters[0].args.length === 0
                        ) {
                            onlyOneAccessor = true;
                            preCondExpr = prop.expr.segs[0].expr;
                        }
                    }

                    if (onlyOneAccessor) {
                        sourceBuffer.addRaw('if (' + compileExprSource.expr(preCondExpr) + ') {');
                    }

                    sourceBuffer.joinRaw('attrFilter("' + prop.name + '", '
                        + (prop.x ? 'escapeHTML(' : '')
                        + compileExprSource.expr(prop.expr)
                        + (prop.x ? ')' : '')
                        + ')'
                    );

                    if (onlyOneAccessor) {
                        sourceBuffer.addRaw('}');
                    }

                    break;
            }
        });

        if (bindDirective) {
            sourceBuffer.addRaw(
                '(function ($bindObj) {for (var $key in $bindObj) {'
                + 'var $value = $bindObj[$key];'
            );

            if (tagName === 'textarea') {
                sourceBuffer.addRaw(
                    'if ($key === "value") {'
                    + 'continue;'
                    + '}'
                );
            }

            sourceBuffer.addRaw('switch ($key) {\n'
                + 'case "readonly":\n'
                + 'case "disabled":\n'
                + 'case "multiple":\n'
                + 'case "multiple":\n'
                + 'html += boolAttrFilter($key, escapeHTML($value));\n'
                + 'break;\n'
                + 'default:\n'
                + 'html += attrFilter($key, escapeHTML($value));'
                + '}'
            );

            sourceBuffer.addRaw(
                '}})('
                + compileExprSource.expr(bindDirective.value)
                + ');'
            );
        }

        sourceBuffer.joinString('>');
    },
    /* eslint-enable max-params */

    /**
     * 编译元素闭合
     *
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {ANode} aNode 抽象节点
     * @param {string=} tagNameVariable 组件标签为外部动态传入时的标签变量名
     */
    tagEnd: function (sourceBuffer, aNode, tagNameVariable) {
        var tagName = aNode.tagName;

        if (tagName) {
            if (!autoCloseTags[tagName]) {
                sourceBuffer.joinString('</' + tagName + '>');
            }

            if (tagName === 'select') {
                sourceBuffer.addRaw('$selectValue = null;');
            }

            if (tagName === 'option') {
                sourceBuffer.addRaw('$optionValue = null;');
            }
        }
        else {
            sourceBuffer.joinString('</');
            sourceBuffer.joinRaw(tagNameVariable + ' || "div"');
            sourceBuffer.joinString('>');
        }
    },

    /**
     * 编译元素内容
     *
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {ANode} aNode 元素的抽象节点信息
     * @param {Component} owner 所属组件实例环境
     */
    inner: function (sourceBuffer, aNode, owner) {
        // inner content
        if (aNode.tagName === 'textarea') {
            var valueProp = getANodeProp(aNode, 'value');
            if (valueProp) {
                sourceBuffer.joinRaw('escapeHTML('
                    + compileExprSource.expr(valueProp.expr)
                    + ')'
                );
            }

            return;
        }

        var htmlDirective = aNode.directives.html;
        if (htmlDirective) {
            sourceBuffer.joinExpr(htmlDirective.value);
        }
        else {
            /* eslint-disable no-use-before-define */
            each(aNode.children, function (aNodeChild) {
                aNodeCompiler.compile(aNodeChild, sourceBuffer, owner);
            });
            /* eslint-enable no-use-before-define */
        }
    }
};

/**
 * ANode 的编译方法集合对象
 *
 * @inner
 */
var aNodeCompiler = {

    /**
     * 编译节点
     *
     * @param {ANode} aNode 抽象节点
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     * @param {Object} extra 编译所需的一些额外信息
     */
    compile: function (aNode, sourceBuffer, owner, extra) {
        extra = extra || {};
        var compileMethod = 'compileElement';

        if (aNode.textExpr) {
            compileMethod = 'compileText';
        }
        else if (aNode.directives['if']) { // eslint-disable-line dot-notation
            compileMethod = 'compileIf';
        }
        else if (aNode.directives['for']) { // eslint-disable-line dot-notation
            compileMethod = 'compileFor';
        }
        else if (aNode.tagName === 'slot') {
            compileMethod = 'compileSlot';
        }
        else if (aNode.tagName === 'template') {
            compileMethod = 'compileTemplate';
        }
        else {
            var ComponentType = owner.getComponentType
                ? owner.getComponentType(aNode)
                : owner.components[aNode.tagName];

            if (ComponentType) {
                compileMethod = 'compileComponent';
                extra.ComponentClass = ComponentType;

                if (ComponentType instanceof ComponentLoader) {
                    compileMethod = 'compileComponentLoader';
                }
            }
        }

        aNodeCompiler[compileMethod](aNode, sourceBuffer, owner, extra);
    },

    /**
     * 编译文本节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     */
    compileText: function (aNode, sourceBuffer) {
        if (aNode.textExpr.original) {
            sourceBuffer.joinString(serializeStump('text'));
        }

        if (aNode.textExpr.value != null) {
            sourceBuffer.joinString(aNode.textExpr.segs[0].literal);
        }
        else {
            sourceBuffer.joinExpr(aNode.textExpr);
        }

        if (aNode.textExpr.original) {
            sourceBuffer.joinString(serializeStumpEnd('text'));
        }
    },

    /**
     * 编译template节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileTemplate: function (aNode, sourceBuffer, owner) {
        elementSourceCompiler.inner(sourceBuffer, aNode, owner);
    },

    /**
     * 编译 if 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileIf: function (aNode, sourceBuffer, owner) {

        // output main if
        var ifDirective = aNode.directives['if']; // eslint-disable-line dot-notation
        sourceBuffer.addRaw('if (' + compileExprSource.expr(ifDirective.value) + ') {');
        sourceBuffer.addRaw(
            aNodeCompiler.compile(
                aNode.ifRinsed,
                sourceBuffer,
                owner
            )
        );
        sourceBuffer.addRaw('}');

        // output elif and else
        each(aNode.elses, function (elseANode) {
            var elifDirective = elseANode.directives.elif;
            if (elifDirective) {
                sourceBuffer.addRaw('else if (' + compileExprSource.expr(elifDirective.value) + ') {');
            }
            else {
                sourceBuffer.addRaw('else {');
            }

            sourceBuffer.addRaw(
                aNodeCompiler.compile(
                    elseANode,
                    sourceBuffer,
                    owner
                )
            );
            sourceBuffer.addRaw('}');
        });
    },

    /**
     * 编译 for 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileFor: function (aNode, sourceBuffer, owner) {
        var forElementANode = {
            children: aNode.children,
            props: aNode.props,
            events: aNode.events,
            tagName: aNode.tagName,
            directives: extend({}, aNode.directives),
            hotspot: aNode.hotspot
        };
        forElementANode.directives['for'] = null;

        var forDirective = aNode.directives['for']; // eslint-disable-line dot-notation
        var itemName = forDirective.item;
        var indexName = forDirective.index || genSSRId();
        var listName = genSSRId();


        sourceBuffer.addRaw('var ' + listName + ' = ' + compileExprSource.expr(forDirective.value) + ';');
        sourceBuffer.addRaw('if (' + listName + ' instanceof Array) {');

        // for array
        sourceBuffer.addRaw('for ('
            + 'var ' + indexName + ' = 0; '
            + indexName + ' < ' + listName + '.length; '
            + indexName + '++) {'
        );
        sourceBuffer.addRaw('componentCtx.data.' + indexName + '=' + indexName + ';');
        sourceBuffer.addRaw('componentCtx.data.' + itemName + '= ' + listName + '[' + indexName + '];');
        sourceBuffer.addRaw(
            aNodeCompiler.compile(
                forElementANode,
                sourceBuffer,
                owner
            )
        );
        sourceBuffer.addRaw('}');

        sourceBuffer.addRaw('} else if (typeof ' + listName + ' === "object") {');

        // for object
        sourceBuffer.addRaw('for (var ' + indexName + ' in ' + listName + ') {');
        sourceBuffer.addRaw('if (' + listName + '[' + indexName + '] != null) {');
        sourceBuffer.addRaw('componentCtx.data.' + indexName + '=' + indexName + ';');
        sourceBuffer.addRaw('componentCtx.data.' + itemName + '= ' + listName + '[' + indexName + '];');
        sourceBuffer.addRaw(
            aNodeCompiler.compile(
                forElementANode,
                sourceBuffer,
                owner
            )
        );
        sourceBuffer.addRaw('}');
        sourceBuffer.addRaw('}');

        sourceBuffer.addRaw('}');
    },

    /**
     * 编译 slot 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileSlot: function (aNode, sourceBuffer, owner) {
        var rendererId = genSSRId();

        sourceBuffer.addRaw('componentCtx.slotRenderers.' + rendererId
            + ' = componentCtx.slotRenderers.' + rendererId + ' || function () {');

        sourceBuffer.addRaw('function $defaultSlotRender(componentCtx) {');
        sourceBuffer.addRaw('  var html = "";');
        each(aNode.children, function (aNodeChild) {
            sourceBuffer.addRaw(aNodeCompiler.compile(aNodeChild, sourceBuffer, owner));
        });
        sourceBuffer.addRaw('  return html;');
        sourceBuffer.addRaw('}');

        sourceBuffer.addRaw('var $isInserted = false;');
        sourceBuffer.addRaw('var $ctxSourceSlots = componentCtx.sourceSlots;');
        sourceBuffer.addRaw('var $mySourceSlots = [];');

        var nameProp = getANodeProp(aNode, 'name');
        if (nameProp) {
            sourceBuffer.addRaw('var $slotName = ' + compileExprSource.expr(nameProp.expr) + ';');

            sourceBuffer.addRaw('for (var $i = 0; $i < $ctxSourceSlots.length; $i++) {');
            sourceBuffer.addRaw('  if ($ctxSourceSlots[$i][1] == $slotName) {');
            sourceBuffer.addRaw('    $mySourceSlots.push($ctxSourceSlots[$i][0]);');
            sourceBuffer.addRaw('    $isInserted = true;');
            sourceBuffer.addRaw('  }');
            sourceBuffer.addRaw('}');
        }
        else {
            sourceBuffer.addRaw('if ($ctxSourceSlots[0] && $ctxSourceSlots[0][1] == null) {');
            sourceBuffer.addRaw('  $mySourceSlots.push($ctxSourceSlots[0][0]);');
            sourceBuffer.addRaw('  $isInserted = true;');
            sourceBuffer.addRaw('}');
        }

        sourceBuffer.addRaw('if (!$isInserted) { $mySourceSlots.push($defaultSlotRender); }');
        sourceBuffer.addRaw('var $slotCtx = $isInserted ? componentCtx.owner : componentCtx;');

        if (aNode.vars || aNode.directives.bind) {
            sourceBuffer.addRaw('$slotCtx = {data: extend({}, $slotCtx.data), proto: $slotCtx.proto, owner: $slotCtx.owner};'); // eslint-disable-line

            if (aNode.directives.bind) {
                sourceBuffer.addRaw('extend($slotCtx.data, ' + compileExprSource.expr(aNode.directives.bind.value) + ');'); // eslint-disable-line
            }

            each(aNode.vars, function (varItem) {
                sourceBuffer.addRaw(
                    '$slotCtx.data["' + varItem.name + '"] = '
                    + compileExprSource.expr(varItem.expr)
                    + ';'
                );
            });
        }

        sourceBuffer.addRaw('for (var $renderIndex = 0; $renderIndex < $mySourceSlots.length; $renderIndex++) {');
        sourceBuffer.addRaw('  html += $mySourceSlots[$renderIndex]($slotCtx);');
        sourceBuffer.addRaw('}');

        sourceBuffer.addRaw('};');
        sourceBuffer.addRaw('componentCtx.slotRenderers.' + rendererId + '();');
    },

    /**
     * 编译普通节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     * @param {Object} extra 编译所需的一些额外信息
     */
    compileElement: function (aNode, sourceBuffer, owner) {
        elementSourceCompiler.tagStart(sourceBuffer, aNode);
        elementSourceCompiler.inner(sourceBuffer, aNode, owner);
        elementSourceCompiler.tagEnd(sourceBuffer, aNode);
    },

    /**
     * 编译组件节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     * @param {Object} extra 编译所需的一些额外信息
     * @param {Function} extra.ComponentClass 对应组件类
     */
    compileComponent: function (aNode, sourceBuffer, owner, extra) {
        var dataLiteral = '{}';

        sourceBuffer.addRaw('var $sourceSlots = [];');
        if (aNode.children) {
            var defaultSourceSlots = [];
            var sourceSlotCodes = {};

            each(aNode.children, function (child) {
                var slotBind = !child.textExpr && getANodeProp(child, 'slot');
                if (slotBind) {
                    if (!sourceSlotCodes[slotBind.raw]) {
                        sourceSlotCodes[slotBind.raw] = {
                            children: [],
                            prop: slotBind
                        };
                    }

                    sourceSlotCodes[slotBind.raw].children.push(child);
                }
                else {
                    defaultSourceSlots.push(child);
                }
            });

            if (defaultSourceSlots.length) {
                sourceBuffer.addRaw('$sourceSlots.push([function (componentCtx) {');
                sourceBuffer.addRaw('  var html = "";');
                defaultSourceSlots.forEach(function (child) {
                    aNodeCompiler.compile(child, sourceBuffer, owner);
                });
                sourceBuffer.addRaw('  return html;');
                sourceBuffer.addRaw('}]);');
            }

            for (var key in sourceSlotCodes) {
                var sourceSlotCode = sourceSlotCodes[key];
                sourceBuffer.addRaw('$sourceSlots.push([function (componentCtx) {');
                sourceBuffer.addRaw('  var html = "";');
                sourceBuffer.addRaw(sourceSlotCode.children.forEach(function (child) {
                    aNodeCompiler.compile(child, sourceBuffer, owner);
                }));
                sourceBuffer.addRaw('  return html;');
                sourceBuffer.addRaw('}, ' + compileExprSource.expr(sourceSlotCode.prop.expr) + ']);');
            }
        }


        var givenData = [];
        each(camelComponentBinds(aNode.props), function (prop) {
            postProp(prop);
            givenData.push(
                compileExprSource.stringLiteralize(prop.name)
                + ':'
                + compileExprSource.expr(prop.expr)
            );
        });

        dataLiteral = '{' + givenData.join(',\n') + '}';
        if (aNode.directives.bind) {
            dataLiteral = 'extend('
                + compileExprSource.expr(aNode.directives.bind.value)
                + ', '
                + dataLiteral
                + ')';
        }

        var renderId = compileComponentSource(sourceBuffer, extra.ComponentClass, owner.ssrContextId);
        sourceBuffer.addRaw('html += componentRenderers.' + renderId + '(');
        sourceBuffer.addRaw(dataLiteral + ', true, componentCtx, '
            + stringifier.str(aNode.tagName) + ', $sourceSlots);');
        sourceBuffer.addRaw('$sourceSlots = null;');
    },

    /**
     * 编译组件加载器节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     * @param {Object} extra 编译所需的一些额外信息
     * @param {Function} extra.ComponentClass 对应类
     */
    compileComponentLoader: function (aNode, sourceBuffer, owner, extra) {
        var LoadingComponent = extra.ComponentClass.placeholder;
        if (typeof LoadingComponent === 'function') {
            aNodeCompiler.compileComponent(aNode, sourceBuffer, owner, {
                ComponentClass: LoadingComponent
            });
        }
    }
};

/**
 * 生成组件构建的代码
 *
 * @inner
 * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
 * @param {Function} ComponentClass 组件类
 * @param {string} contextId 构建render环境的id
 * @return {string} 组件在当前环境下的方法标识
 */
function compileComponentSource(sourceBuffer, ComponentClass, contextId) {
    ComponentClass.ssrContext = ComponentClass.ssrContext || {};
    var componentIdInContext = ComponentClass.ssrContext[contextId];

    if (!componentIdInContext) {
        componentIdInContext = genSSRId();
        ComponentClass.ssrContext[contextId] = componentIdInContext;

        // 先初始化个实例，让模板编译成 ANode，并且能获得初始化数据
        var component = new ComponentClass();
        component.ssrContextId = contextId;

        if (component.components) {
            Object.keys(component.components).forEach(
                function (key) {
                    var CmptClass = component.components[key];
                    if (CmptClass instanceof ComponentLoader) {
                        CmptClass = CmptClass.placeholder;
                    }

                    if (CmptClass) {
                        compileComponentSource(sourceBuffer, CmptClass, contextId);
                    }
                }
            );
        }

        sourceBuffer.addRaw('componentRenderers.' + componentIdInContext + ' = componentRenderers.'
            + componentIdInContext + '|| ' + componentIdInContext + ';');

        sourceBuffer.addRaw('var ' + componentIdInContext + 'Proto = ' + genComponentProtoCode(component));
        sourceBuffer.addRaw('function ' + componentIdInContext
            + '(data, noDataOutput, parentCtx, tagName, sourceSlots) {');
        sourceBuffer.addRaw('var html = "";');

        sourceBuffer.addRaw(genComponentContextCode(component, componentIdInContext));


        // init data
        var defaultData = component.data.get();
        sourceBuffer.addRaw('if (data) {');
        Object.keys(defaultData).forEach(function (key) {
            sourceBuffer.addRaw('componentCtx.data["' + key + '"] = componentCtx.data["' + key + '"] || '
                + stringifier.any(defaultData[key]) + ';');
        });
        sourceBuffer.addRaw('}');

        // calc computed
        sourceBuffer.addRaw('var computedNames = componentCtx.proto.computedNames;');
        sourceBuffer.addRaw('for (var $i = 0; $i < computedNames.length; $i++) {');
        sourceBuffer.addRaw('  var $computedName = computedNames[$i];');
        sourceBuffer.addRaw('  data[$computedName] = componentCtx.proto.computed[$computedName](componentCtx);');
        sourceBuffer.addRaw('}');


        var ifDirective = component.aNode.directives['if']; // eslint-disable-line dot-notation
        if (ifDirective) {
            sourceBuffer.addRaw('if (' + compileExprSource.expr(ifDirective.value) + ') {');
        }

        elementSourceCompiler.tagStart(sourceBuffer, component.aNode, 'tagName');


        sourceBuffer.addRaw('if (!noDataOutput) {');
        sourceBuffer.joinDataStringify();
        sourceBuffer.addRaw('}');


        elementSourceCompiler.inner(sourceBuffer, component.aNode, component);
        elementSourceCompiler.tagEnd(sourceBuffer, component.aNode, 'tagName');

        if (ifDirective) {
            sourceBuffer.addRaw('}');
        }

        sourceBuffer.addRaw('return html;');
        sourceBuffer.addRaw('};');
    }

    return componentIdInContext;
}

/**
 * 生成组件 renderer 时 ctx 对象构建的代码
 *
 * @inner
 * @param {Object} component 组件实例
 * @return {string}
 */
function genComponentContextCode(component, componentIdInContext) {
    var code = ['var componentCtx = {'];

    // proto
    code.push('proto: ' + componentIdInContext + 'Proto,');

    // sourceSlots
    code.push('sourceSlots: sourceSlots,');

    // data
    var defaultData = component.data.get();
    code.push('data: data || ' + stringifier.any(defaultData) + ',');

    // parentCtx
    code.push('owner: parentCtx,');

    // slotRenderers
    code.push('slotRenderers: {}');

    code.push('};');

    return code.join('\n');
}

/**
 * 生成组件 proto 对象构建的代码
 *
 * @inner
 * @param {Object} component 组件实例
 * @return {string}
 */
function genComponentProtoCode(component) {
    var code = ['{'];

    // members for call expr
    var ComponentProto = component.constructor.prototype;
    Object.keys(ComponentProto).forEach(function (protoMemberKey) {
        var protoMember = ComponentProto[protoMemberKey];
        if (COMPONENT_RESERVED_MEMBERS[protoMemberKey] || !protoMember) {
            return;
        }

        switch (typeof protoMember) {
            case 'function':
                code.push(protoMemberKey + ': ' + protoMember.toString() + ',');
                break;

            case 'object':
                code.push(protoMemberKey + ':');

                if (protoMember instanceof Array) {
                    code.push('[');
                    protoMember.forEach(function (item) {
                        code.push(typeof item === 'function' ? item.toString() : '' + ',');
                    });
                    code.push(']');
                }
                else {
                    code.push('{');
                    Object.keys(protoMember).forEach(function (itemKey) {
                        var item = protoMember[itemKey];
                        if (typeof item === 'function') {
                            code.push(itemKey + ':' + item.toString() + ',');
                        }
                    });
                    code.push('}');
                }

                code.push(',');
        }
    });

    // filters
    code.push('filters: {');
    var filterCode = [];
    for (var key in component.filters) {
        if (component.filters.hasOwnProperty(key)) {
            var filter = component.filters[key];

            if (typeof filter === 'function') {
                filterCode.push(key + ': ' + filter.toString());
            }
        }
    }
    code.push(filterCode.join(','));
    code.push('},');

    /* eslint-disable no-redeclare */
    // computed obj
    code.push('computed: {');
    var computedCode = [];
    var computedNamesCode = [];
    var computedNamesIndex = {};
    for (var key in component.computed) {
        if (component.computed.hasOwnProperty(key)) {
            var computed = component.computed[key];

            if (typeof computed === 'function') {
                if (!computedNamesIndex[key]) {
                    computedNamesIndex[key] = 1;
                    computedNamesCode.push('"' + key + '"');
                }

                computedCode.push(key + ': '
                    + computed.toString()
                        .replace(/^\s*function\s*\(/, 'function (componentCtx')
                        .replace(
                            /this.data.get\(([^\)]+)\)/g,
                            function (match, exprLiteral) {
                                var exprStr = (new Function('return ' + exprLiteral))();
                                var expr = parseExpr(exprStr);

                                var ident = expr.paths[0].value;
                                if (component.computed.hasOwnProperty(ident)
                                    && !computedNamesIndex[ident]
                                ) {
                                    computedNamesIndex[ident] = 1;
                                    computedNamesCode.unshift('"' + ident + '"');
                                }

                                return compileExprSource.expr(expr);
                            }
                        )
                );
            }
        }
    }
    code.push(computedCode.join(','));
    code.push('},');

    // computed names
    code.push('computedNames: [');
    code.push(computedNamesCode.join(','));
    code.push('],');
    /* eslint-enable no-redeclare */

    // tagName
    code.push('tagName: "' + component.tagName + '"');
    code.push('};');

    return code.join('\n');
}

/* eslint-enable guard-for-in */

/**
 * 将组件编译成 render 方法的 js 源码
 *
 * @param {Function} ComponentClass 组件类
 * @return {string}
 */
function compileJSSource(ComponentClass) {
    var sourceBuffer = new CompileSourceBuffer();
    var contextId = genSSRId();

    sourceBuffer.addRendererStart();
    var renderId = compileComponentSource(sourceBuffer, ComponentClass, contextId);
    sourceBuffer.addRaw('return componentRenderers.' + renderId + '(data, noDataOutput)');
    sourceBuffer.addRendererEnd();

    return sourceBuffer.toCode();
}
// #[end]

exports = module.exports = compileJSSource;
