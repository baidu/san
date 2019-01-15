/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将组件编译成 render 方法的 js 源码
 */


var each = require('../util/each');
var guid = require('../util/guid');
var splitStr2Obj = require('../util/split-str-2-obj');
var parseExpr = require('../parser/parse-expr');
var createANode = require('../parser/create-a-node');
var cloneDirectives = require('../parser/clone-directives');
var autoCloseTags = require('../browser/auto-close-tags');
var CompileSourceBuffer = require('./compile-source-buffer');
var compileExprSource = require('./compile-expr-source');
var rinseCondANode = require('./rinse-cond-anode');
var getANodeProp = require('./get-a-node-prop');
var ComponentLoader = require('./component-loader');

// #[begin] ssr

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
     * @param {string} tagName 标签名
     * @param {Array} props 属性列表
     * @param {Object=} bindDirective bind指令对象
     */
    tagStart: function (sourceBuffer, tagName, props, bindDirective) {
        sourceBuffer.joinString('<' + tagName);

        // index list
        var propsIndex = {};
        each(props, function (prop) {
            propsIndex[prop.name] = prop;
        });

        each(props, function (prop) {
            if (prop.name === 'slot') {
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
                    if (prop.attr) {
                        sourceBuffer.joinString(' ' + prop.attr);
                    }
                    else {
                        sourceBuffer.joinRaw('attrFilter("' + prop.name + '", '
                            + (prop.x ? 'escapeHTML(' : '')
                            + compileExprSource.expr(prop.expr)
                            + (prop.x ? ')' : '')
                            + ')'
                        );
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
     * @param {string} tagName 标签名
     */
    tagEnd: function (sourceBuffer, tagName) {
        if (!autoCloseTags[tagName]) {
            sourceBuffer.joinString('</' + tagName + '>');
        }

        if (tagName === 'select') {
            sourceBuffer.addRaw('$selectValue = null;');
        }

        if (tagName === 'option') {
            sourceBuffer.addRaw('$optionValue = null;');
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
                sourceBuffer.addRaw(aNodeCompiler.compile(aNodeChild, sourceBuffer, owner));
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

        sourceBuffer.joinExpr(aNode.textExpr);

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
        sourceBuffer.addRaw('(function () {');

        sourceBuffer.addRaw('var ifIndex = null;');

        // output main if
        var ifDirective = aNode.directives['if']; // eslint-disable-line dot-notation
        sourceBuffer.addRaw('if (' + compileExprSource.expr(ifDirective.value) + ') {');
        sourceBuffer.addRaw(
            aNodeCompiler.compile(
                rinseCondANode(aNode),
                sourceBuffer,
                owner
            )
        );
        sourceBuffer.addRaw('}');

        // output elif and else
        each(aNode.elses, function (elseANode, index) {
            var elifDirective = elseANode.directives.elif;
            if (elifDirective) {
                sourceBuffer.addRaw('else if (' + compileExprSource.expr(elifDirective.value) + ') {');
            }
            else {
                sourceBuffer.addRaw('else {');
            }

            sourceBuffer.addRaw(
                aNodeCompiler.compile(
                    rinseCondANode(elseANode),
                    sourceBuffer,
                    owner
                )
            );
            sourceBuffer.addRaw('}');
        });

        sourceBuffer.addRaw('})();');
    },

    /**
     * 编译 for 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileFor: function (aNode, sourceBuffer, owner) {
        var forElementANode = createANode({
            children: aNode.children,
            props: aNode.props,
            events: aNode.events,
            tagName: aNode.tagName,
            directives: cloneDirectives(aNode.directives, {
                'for': 1
            }),
            hotspot: aNode.hotspot
        });

        var forDirective = aNode.directives['for']; // eslint-disable-line dot-notation
        var itemName = forDirective.item.raw;
        var indexName = forDirective.index.raw;
        var listName = guid();

        if (indexName === '$index') {
            indexName = guid();
        }

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
        sourceBuffer.addRaw('(function () {');

        sourceBuffer.addRaw('function $defaultSlotRender(componentCtx) {');
        sourceBuffer.addRaw('  var html = "";');
        each(aNode.children, function (aNodeChild) {
            sourceBuffer.addRaw(aNodeCompiler.compile(aNodeChild, sourceBuffer, owner));
        });
        sourceBuffer.addRaw('  return html;');
        sourceBuffer.addRaw('}');

        sourceBuffer.addRaw('  var $mySourceSlots = [];');

        var nameProp = getANodeProp(aNode, 'name');
        if (nameProp) {
            sourceBuffer.addRaw('var $slotName = ' + compileExprSource.expr(nameProp.expr) + ';');
        }
        else {
            sourceBuffer.addRaw('var $slotName = null;');
        }

        sourceBuffer.addRaw('var $ctxSourceSlots = componentCtx.sourceSlots;');
        sourceBuffer.addRaw('for (var $i = 0; $i < $ctxSourceSlots.length; $i++) {');
        sourceBuffer.addRaw('  if ($ctxSourceSlots[$i][1] == $slotName) {');
        sourceBuffer.addRaw('    $mySourceSlots.push($ctxSourceSlots[$i][0]);');
        sourceBuffer.addRaw('  }');
        sourceBuffer.addRaw('}');


        sourceBuffer.addRaw('var $isInserted = $mySourceSlots.length > 0;');
        sourceBuffer.addRaw('if (!$isInserted) { $mySourceSlots.push($defaultSlotRender); }');

        sourceBuffer.addRaw('var $slotCtx = $isInserted ? componentCtx.owner : componentCtx;');

        if (aNode.vars || aNode.directives.bind) {
            sourceBuffer.addRaw('$slotCtx = {data: extend({}, $slotCtx.data), filters: $slotCtx.filters, callFilter: $slotCtx.callFilter};'); // eslint-disable-line

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

        sourceBuffer.addRaw('})();');
    },

    /**
     * 编译普通节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     * @param {Object} extra 编译所需的一些额外信息
     */
    compileElement: function (aNode, sourceBuffer, owner, extra) {
        extra = extra || {};
        // if (aNode.tagName === 'option'
        //     && !getANodeProp(aNode, 'value')
        //     && aNode.children[0]
        // ) {
        //     aNode.props.push({
        //         name: 'value',
        //         expr: aNode.children[0].textExpr
        //     });
        // }

        elementSourceCompiler.tagStart(
            sourceBuffer,
            aNode.tagName,
            aNode.props,
            aNode.directives.bind
        );

        elementSourceCompiler.inner(sourceBuffer, aNode, owner);
        elementSourceCompiler.tagEnd(sourceBuffer, aNode.tagName);
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

        sourceBuffer.addRaw('var $slotName = null;');
        sourceBuffer.addRaw('var $sourceSlots = [];');
        each(aNode.children, function (child) {
            var slotBind = !child.textExpr && getANodeProp(child, 'slot');
            if (slotBind) {
                sourceBuffer.addRaw('$slotName = ' + compileExprSource.expr(slotBind.expr) + ';');
                sourceBuffer.addRaw('$sourceSlots.push([function (componentCtx) {');
                sourceBuffer.addRaw('  var html = "";');
                sourceBuffer.addRaw(aNodeCompiler.compile(child, sourceBuffer, owner));
                sourceBuffer.addRaw('  return html;');
                sourceBuffer.addRaw('}, $slotName]);');
            }
            else {
                sourceBuffer.addRaw('$sourceSlots.push([function (componentCtx) {');
                sourceBuffer.addRaw('  var html = "";');
                sourceBuffer.addRaw(aNodeCompiler.compile(child, sourceBuffer, owner));
                sourceBuffer.addRaw('  return html;');
                sourceBuffer.addRaw('}]);');
            }
        });

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

        var ComponentClass = extra.ComponentClass;

        var component = new ComponentClass({
            source: aNode,
            owner: owner,
            subTag: aNode.tagName
        });

        sourceBuffer.addRaw('html += (');
        compileComponentSource(sourceBuffer, component);
        sourceBuffer.addRaw(')(' + dataLiteral + ', componentCtx, $sourceSlots);');
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
 * 生成组件 renderer 时 ctx 对象构建的代码
 *
 * @inner
 * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
 * @param {Object} component 组件实例
 */
function compileComponentSource(sourceBuffer, component) {
    // 先初始化个实例，让模板编译成 ANode，并且能获得初始化数据
    // var component = new ComponentClass();

    sourceBuffer.addRaw('function (data, parentCtx, sourceSlots) {');
    sourceBuffer.addRaw('var html = "";');

    sourceBuffer.addRaw(genComponentContextCode(component));
    sourceBuffer.addRaw('componentCtx.owner = parentCtx;');
    sourceBuffer.addRaw('componentCtx.sourceSlots = sourceSlots;');


    // init data and calc computed
    // TODO: computed dep computed, maybe has bug
    sourceBuffer.addRaw('data = extend(componentCtx.data, data);');
    sourceBuffer.addRaw('for (var $i = 0; $i < componentCtx.computedNames.length; $i++) {');
    sourceBuffer.addRaw('  var $computedName = componentCtx.computedNames[$i];');
    sourceBuffer.addRaw('  data[$computedName] = componentCtx.computed[$computedName]();');
    sourceBuffer.addRaw('}');


    elementSourceCompiler.tagStart(
        sourceBuffer,
        component.tagName,
        component.aNode.props,
        component.aNode.directives.bind
    );


    sourceBuffer.addRaw('if (!parentCtx) {');
    sourceBuffer.joinString('<!--s-data:');
    sourceBuffer.joinDataStringify();
    sourceBuffer.joinString('-->');
    sourceBuffer.addRaw('}');


    elementSourceCompiler.inner(sourceBuffer, component.aNode, component);
    elementSourceCompiler.tagEnd(sourceBuffer, component.tagName);

    sourceBuffer.addRaw('return html;');
    sourceBuffer.addRaw('}');
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

var COMPONENT_RESERVED_MEMBERS = splitStr2Obj('computed,filters,components,'
    + 'initData,template,attached,created,detached,disposed,compiled'
);

/**
 * 生成组件 renderer 时 ctx 对象构建的代码
 *
 * @inner
 * @param {Object} component 组件实例
 * @return {string}
 */
function genComponentContextCode(component) {
    var code = ['var componentCtx = {'];

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

    // given anode
    code.push('sourceSlots: [],');

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

    code.push(
        'callFilter: function (name, args) {',
        '    var filter = this.filters[name] || DEFAULT_FILTERS[name];',
        '    if (typeof filter === "function") {',
        '        return filter.apply(this, args);',
        '    }',
        '},'
    );

    /* eslint-disable no-redeclare */
    // computed obj
    code.push('computed: {');
    var computedCode = [];
    for (var key in component.computed) {
        if (component.computed.hasOwnProperty(key)) {
            var computed = component.computed[key];

            if (typeof computed === 'function') {
                computedCode.push(key + ': '
                    + computed.toString().replace(
                        /this.data.get\(([^\)]+)\)/g,
                        function (match, exprLiteral) {
                            var exprStr = (new Function('return ' + exprLiteral))();
                            var expr = parseExpr(exprStr);

                            return compileExprSource.expr(expr);
                        })
                );
            }
        }
    }
    code.push(computedCode.join(','));
    code.push('},');

    // computed names
    code.push('computedNames: [');
    computedCode = [];
    for (var key in component.computed) {
        if (component.computed.hasOwnProperty(key)) {
            var computed = component.computed[key];

            if (typeof computed === 'function') {
                computedCode.push('"' + key + '"');
            }
        }
    }
    code.push(computedCode.join(','));
    code.push('],');
    /* eslint-enable no-redeclare */

    // data
    code.push('data: ' + stringifier.any(component.data.get()) + ',');

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

    sourceBuffer.addRendererStart();

    // 先初始化个实例，让模板编译成 ANode，并且能获得初始化数据
    var component = new ComponentClass();

    sourceBuffer.addRaw('var render = ');
    compileComponentSource(sourceBuffer, component);
    sourceBuffer.addRaw(';\nreturn render(data);');
    sourceBuffer.addRendererEnd();
    return sourceBuffer.toCode();
}
// #[end]

exports = module.exports = compileJSSource;
