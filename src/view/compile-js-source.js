/**
 * @file 将组件编译成 render 方法的 js 源码
 * @author errorrik(errorrik@gmail.com)
 */

var serializeStump = require('./serialize-stump');
var ExprType = require('../parser/expr-type');
var CompileSourceBuffer = require('./compile-source-buffer');
var compileExprSource = require('./compile-expr-source');


// #[begin] ssr

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
     */
    compile: function (aNode, sourceBuffer, owner, extra) {
        extra = extra || {};
        var compileMethod = 'compileElement';

        if (aNode.isText) {
            compileMethod = 'compileText';
        }
        else if (aNode.directives.get('if')) {
            compileMethod = 'compileIf';
        }
        else if (aNode.directives.get('else')) {
            compileMethod = 'compileElse';
        }
        else if (aNode.directives.get('for')) {
            compileMethod = 'compileFor';
        }
        else if (aNode.tagName === 'slot') {
            compileMethod = 'compileSlot';
        }
        else {
            var ComponentType = owner.components[aNode.tagName];
            if (ComponentType) {
                compileMethod = 'compileComponent';
                extra.ComponentClass = ComponentType;
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
        sourceBuffer.joinExpr(aNode.textExpr);

        if (!aNode.textExpr.value) {
            sourceBuffer.joinString(serializeStump('text', aNode.text));
        }
    },

    /**
     * 编译 if 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileIf: function (aNode, sourceBuffer, owner) {
        var ifElementANode = new ANode({
            childs: aNode.childs,
            props: aNode.props,
            events: aNode.events,
            tagName: aNode.tagName,
            directives: (new IndexedList()).concat(aNode.directives)
        });
        ifElementANode.directives.remove('if');

        var ifDirective = aNode.directives.get('if');
        var elseANode = aNode.elseANode;

        // for condition true content
        sourceBuffer.addRaw('if (' + compileExprSource.expr(ifDirective.value) + ') {');
        sourceBuffer.addRaw(
            aNodeCompiler.compile(
                ifElementANode,
                sourceBuffer,
                owner,
                {prop: ' san-if="' + escapeHTML(ifDirective.raw) + '"'}
            )
        );
        if (elseANode) {
            sourceBuffer.joinString(serializeStump('else', serializeANode(elseANode)));
        }

        // for condition false content
        sourceBuffer.addRaw('} else {');
        sourceBuffer.joinString(serializeStump('if', serializeANode(aNode)));

        if (elseANode) {
            var elseElementANode = new ANode({
                childs: elseANode.childs,
                props: elseANode.props,
                events: elseANode.events,
                tagName: elseANode.tagName,
                directives: (new IndexedList()).concat(elseANode.directives)
            });
            elseElementANode.directives.remove('else');
            sourceBuffer.addRaw(
                aNodeCompiler.compile(
                    elseElementANode,
                    sourceBuffer,
                    owner,
                    {prop: ' san-else'}
                )
            );
        }

        sourceBuffer.addRaw('}');
    },

    /**
     * 编译 else 节点
     *
     * @param {ANode} aNode 节点对象
     */
    compileElse: function (aNode) {
        // 啥都不干，交给 compileIf 了
    },

    /**
     * 编译 for 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileFor: function (aNode, sourceBuffer, owner) {
        var forElementANode = new ANode({
            childs: aNode.childs,
            props: aNode.props,
            events: aNode.events,
            tagName: aNode.tagName,
            directives: (new IndexedList()).concat(aNode.directives)
        });
        forElementANode.directives.remove('for');

        var forDirective = aNode.directives.get('for');
        var itemName = forDirective.item.raw;
        var indexName = forDirective.index.raw;
        var listName = compileExprSource.dataAccess(forDirective.list);

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
                owner,
                {prop: ' san-for="' + escapeHTML(forDirective.raw) + '"'}
            )
        );
        sourceBuffer.addRaw('}');

        // for stump
        sourceBuffer.joinString(serializeStump('for', serializeANode(aNode)));
    },

    /**
     * 编译 slot 节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileSlot: function (aNode, sourceBuffer, owner) {
        var nameProp = aNode.props.get('name');
        var name = nameProp ? nameProp.raw : '____';
        var extraProp = nameProp ? ' name="' + name + '"' : '';
        var isGivenContent = 0;
        var childs = aNode.childs;

        if (owner.aNode.givenSlots[name]) {
            isGivenContent = 1;
            childs = owner.aNode.givenSlots[name];
        }


        if (!isGivenContent) {
            extraProp += ' by-default="1"';
        }
        sourceBuffer.joinString(serializeStump('slot-start', '', extraProp));

        if (isGivenContent) {
            sourceBuffer.addRaw('(function (componentCtx) {');
        }

        each(childs, function (aNodeChild) {
            sourceBuffer.addRaw(aNodeCompiler.compile(aNodeChild, sourceBuffer, owner));
        });

        if (isGivenContent) {
            sourceBuffer.addRaw('})(componentCtx.owner);');
        }

        sourceBuffer.joinString(serializeStump('slot-stop'));
    },

    /**
     * 编译普通节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     */
    compileElement: function (aNode, sourceBuffer, owner, extra) {

        // TODO: element和component的过程需要抽取下
        extra = extra || {};
        var tagName = aNode.tagName;
        sourceBuffer.joinString('<' + tagName);
        aNode.props.each(function (bindInfo) {
            sourceBuffer.joinString(' prop-' + bindInfo.name + '="' + bindInfo.raw + '"');
        });

        aNode.props.each(function (prop) {
            if (tagName === 'textarea' && prop.name === 'value') {
                return;
            }

            switch (prop.name) {
                case 'readonly':
                case 'disabled':
                case 'mutiple':
                    break;

                default:
                    if (prop.expr.value) {
                        sourceBuffer.joinString(' ' + prop.name + '="' + prop.expr.value + '"');
                    }
                    else {
                        sourceBuffer.joinString(' ' + prop.name + '="');
                        sourceBuffer.joinExpr(prop.expr);
                        sourceBuffer.joinString('"');
                    }
                    break;
            }
        });
        sourceBuffer.joinString(extra.prop || '');
        sourceBuffer.joinString('>');

        // inner content
        // var valueProp = component.props.get('value');
        // if (tagName === 'textarea' && valueProp) {
        //     if (valueProp) {
        //         sourceBuffer.joinString(valueProp.value);
        //     }
        // }
        // else {

        // }
        mergeIfAndElse(aNode.childs);
        each(aNode.childs, function (aNodeChild) {
            sourceBuffer.addRaw(aNodeCompiler.compile(aNodeChild, sourceBuffer, owner));
        });

        if (!autoCloseTags[tagName]) {
            sourceBuffer.joinString('</' + tagName + '>');
        }
    },

    /**
     * 编译组件节点
     *
     * @param {ANode} aNode 节点对象
     * @param {CompileSourceBuffer} sourceBuffer 编译源码的中间buffer
     * @param {Component} owner 所属组件实例环境
     * @param {Function} extra.ComponentClass 对应组件类
     */
    compileComponent: function (aNode, sourceBuffer, owner, extra) {
        var ComponentClass = extra.ComponentClass;
        var component = new ComponentClass({
            aNode: aNode,
            owner: owner,
            subTag: aNode.tagName
        });

        var givenData = [];

        // TODO: 和component一起做个抽取
        aNode.props.each(function (prop) {
            var expr = prop.expr;

            // 当 text 解析只有一项时，要么就是 string，要么就是 interp
            // interp 有可能是绑定到组件属性的表达式，不希望被 eval text 成 string
            // 所以这里做个处理，只有一项时直接抽出来
            if (expr.type === ExprType.TEXT && expr.segs.length === 1) {
                expr = expr.segs[0];
                if (expr.type === ExprType.INTERP && expr.filters.length === 0) {
                    expr = expr.expr;
                }
            }

            givenData.push(
                compileExprSource.stringLiteralize(prop.name)
                + ':'
                + compileExprSource.expr(expr)
            );
        });

        sourceBuffer.addRaw('html += (');
        sourceBuffer.addRendererStart();
        compileComponentSource(sourceBuffer, component);
        sourceBuffer.addRendererEnd();
        sourceBuffer.addRaw(')({' + givenData.join(',\n') + '}, componentCtx);');
    }
};

// TODO: 重新处理if和else的编译
function mergeIfAndElse(childs) {
    var ifANode;
    each(childs, function (child) {
        if (child.isText) {
            return;
        }

        if (child.directives.get('if')) {
            ifANode = child;
            return;
        }

        if (child.directives.get('else')) {
            if (ifANode) {
                ifANode.elseANode = child;
            }
        }

        ifANode = null;
    });
}


/**
 * 将组件编译成 render 方法的 js 源码
 *
 * @param {Function} ComponentClass 组件类
 * @return {string}
 */
function compileJSSource(ComponentClass) {
    var sourceBuffer = new CompileSourceBuffer();

    sourceBuffer.addRendererStart();
    sourceBuffer.addRaw(
        componentCompilePreCode.toString()
            .split('\n')
            .slice(1)
            .join('\n')
            .replace(/\}\s*$/, '')
    );

    // 先初始化个实例，让模板编译成 ANode，并且能获得初始化数据
    var component = new ComponentClass();

    compileComponentSource(sourceBuffer, component);
    sourceBuffer.addRendererEnd();
    return sourceBuffer.toCode();
}

function compileComponentSource(sourceBuffer, component) {
    var tagName = component.tagName;

    sourceBuffer.addRaw(genComponentContextCode(component));
    sourceBuffer.addRaw('componentCtx.owner = parentCtx;');
    sourceBuffer.addRaw('data = extend(componentCtx.data, data);');

    sourceBuffer.joinString('<' + tagName);
    component.binds.each(function (bindInfo) {
        sourceBuffer.joinString(' prop-' + bindInfo.name + '="' + bindInfo.raw + '"');
    });

    if (component.subTag) {
        sourceBuffer.joinString(' san-component="' + component.subTag + '"');
    }

    component.props.each(function (prop) {
        if (tagName === 'textarea' && prop.name === 'value') {
            return;
        }

        switch (prop.name) {
            case 'readonly':
            case 'disabled':
            case 'mutiple':
                break;

            default:
                if (prop.expr.value) {
                    sourceBuffer.joinString(' ' + prop.name + '="' + prop.expr.value + '"');
                }
                else {
                    sourceBuffer.joinString(' ' + prop.name + '="');
                    sourceBuffer.joinExpr(prop.expr);
                    sourceBuffer.joinString('"');
                }
                break;
        }

        // var value = isComponent(element)
        //     ? evalExpr(prop.expr, element.data, element)
        //     : element.evalExpr(prop.expr, 1);

        // str +=
        //     getPropHandler(element, prop.name)
        //         .input
        //         .attr(element, prop.name, value)
        //     || '';
    });
    sourceBuffer.joinString('>');

    if (!component.owner) {
        sourceBuffer.joinString('<script type="text/san" san-stump="data">');
        sourceBuffer.joinDataStringify();
        sourceBuffer.joinString('</script>');
    }

    // inner content
    // var valueProp = component.props.get('value');
    // if (tagName === 'textarea' && valueProp) {
    //     if (valueProp) {
    //         sourceBuffer.joinString(valueProp.value);
    //     }
    // }
    // else {

    // }
    mergeIfAndElse(component.aNode.childs);
    each(component.aNode.childs, function (aNodeChild) {
        aNodeCompiler.compile(aNodeChild, sourceBuffer, component);
    });

    if (!autoCloseTags[tagName]) {
        sourceBuffer.joinString('</' + tagName + '>');
    }
};

/**
 * 生成组件 renderer 时 ctx 对象构建的代码
 *
 * @inner
 * @param {Object} component 组件实例
 * @return {string}
 */
function genComponentContextCode(component) {
    var code = ['var componentCtx = {'];

    // filters
    code.push('filters: {');
    var filterCode = [];
    for (var key in component.filters) {
        var filter = component.filters[key];

        if (typeof filter === 'function') {
            filterCode.push(key + ': ' + filter.toString());
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

    // computed
    code.push('computed: {');
    var computedCode = [];
    for (var key in component.computed) {
        var computed = component.computed[key];

        if (typeof computed === 'function') {
            computedCode.push(key + ': ' + computed.toString());
        }
    }
    code.push(computedCode.join(','));
    code.push('},');

    // data
    code.push('data: ' + JSON.stringify(component.data.get()) + ',');

    // tagName
    code.push('tagName: "' + component.tagName + '"');
    code.push('};');

    return code.join('\n');
}

/**
 * 组件编译的模板函数
 *
 * @inner
 */
function componentCompilePreCode() {
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    }
    var HTML_ENTITY = {
        /* jshint ignore:start */
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        /* eslint-disable quotes */
        "'": '&#39;'
        /* eslint-enable quotes */
        /* jshint ignore:end */
    };

    /**
     * HTML Filter的替换函数
     *
     * @inner
     * @param {string} c 替换字符
     * @return {string} 替换后的HTML字符实体
     */
    function htmlFilterReplacer(c) {
        return HTML_ENTITY[c];
    }

    /**
     * HTML转义
     *
     * @param {string} source 源串
     * @return {string} 替换结果串
     */
    function escapeHTML(source) {
        if (source == null) {
            return '';
        }

        return String(source).replace(/[&<>"']/g, htmlFilterReplacer);
    }
    var DEFAULT_FILTERS = {
        html: escapeHTML,
        url: encodeURIComponent,
        raw: function (source) {
            return source;
        },
        _class: function (source) {
            if (source instanceof Array) {
                return source.join(' ');
            }

            return source;
        },
        _style: function (source) {
            if (typeof source === 'object') {
                var result = '';
                for (var key in source) {
                    result += key + ':' + source[key] + ';';
                }

                return result;
            }

            return source;
        },
        _sep: function (source, sep) {
            return source ? sep + source : source;
        }
    };
}

// #[end]

exports = module.exports = compileJSSource;
