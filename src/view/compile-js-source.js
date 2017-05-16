
var serializeStump = require('./serialize-stump');
var ExprType = require('../parser/expr-type');

var compileHelper = {
    stringLiteralize: function (source) {
        return '"'
            + source
                .replace(/\x5C/g, '\\\\')
                .replace(/"/g, '\\"')
                .replace(/\x0A/g, '\\n')
                .replace(/\x09/g, '\\t')
                .replace(/\x0D/g, '\\r')
                // .replace( /\x08/g, '\\b' )
                // .replace( /\x0C/g, '\\f' )
            + '"';
    },

    dataAccess: function (accessorExpr) {
        var code = 'componentCtx.data';
        if (accessorExpr) {
            each(accessorExpr.paths, function (path) {
                if (path.type === ExprType.ACCESSOR) {
                    code += '[' + compileHelper.dataAccess(path) + ']';
                    return;
                }

                switch (typeof path.value) {
                    case 'string':
                        code += '.' + path.value;
                        break;

                    case 'number':
                        code += '[' + path.value + ']';
                        break;
                }
            });
        }

        return code;
    },

    interp: function (interpExpr) {
        var code = compileHelper.expr(interpExpr.expr);

        each(interpExpr.filters, function (filter) {
            code = 'componentCtx.callFilter("' + filter.name + '", [' + code;
            each(filter.args, function (arg) {
                code += ', ' + compileHelper.expr(arg);
            });
            code += '])' ;
        });

        return code;
    },

    text: function (textExpr) {
        var code = '';

        each(textExpr.segs, function (seg) {
            if (seg.type === ExprType.INTERP && !seg.filters[0]) {
                seg = {
                    type: ExprType.INTERP,
                    expr: seg.expr,
                    filters:[
                        {
                            type: ExprType.CALL,
                            name: 'html',
                            args: []
                        }
                    ]
                };
            }

            var segCode = compileHelper.expr(seg);
            if (code) {
                code += ' + ' + segCode;
            }
            else {
                code = segCode;
            }
        });

        return code;
    },

    expr: function (expr) {
        switch (expr.type) {
            case ExprType.UNARY:
                return ;

            case ExprType.BINARY:
                return ;

            case ExprType.TERTIARY:
                return ;

            case ExprType.STRING:
                return compileHelper.stringLiteralize(expr.value);

            case ExprType.NUMBER:
                return expr.value;

            case ExprType.ACCESSOR:
                return compileHelper.dataAccess(expr);

            case ExprType.INTERP:
                return compileHelper.interp(expr);

            case ExprType.TEXT:
                return compileHelper.text(expr);
        }
    }
};

/**
 * 创建节点
 *
 * @param {ANode} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model=} scope 所属数据环境
 * @return {Node}
 */
function compileJSSource(aNode, owner, extra) {
    if (aNode.isText) {
        return textJSSource(aNode);
    }

    if (aNode.directives.get('if')) {
        return ifJSSource(aNode, owner, extra);
    }

    if (aNode.directives.get('else')) {
        return elseJSSource(aNode);
    }

    if (aNode.directives.get('for')) {
        return forJSSource(aNode, owner, extra);
    }

    var ComponentType = owner.components[aNode.tagName];
    if (ComponentType) {
        return componentJSSource(ComponentType, {
            aNode: aNode,
            subTag: aNode.tagName,
            owner: owner
        }, extra);
    }

    if (aNode.tagName === 'slot') {
        return slotJSSource(aNode, owner, extra);
    }

    return elementJSSource(aNode, owner, extra);
}

function textJSSource(aNode) {
    var htmlBuffer = new HTMLJoinBuffer();
    htmlBuffer.addExpr(aNode.textExpr);

    if (!aNode.textExpr.value) {
        htmlBuffer.addStringLiteral(serializeStump('text', aNode.text));
    }
    return htmlBuffer.toCode();
}

function ifJSSource(aNode, owner) {
    var ifDirective = aNode.directives.get('if');
    var newANode = new ANode({
        childs: aNode.childs,
        props: aNode.props,
        events: aNode.events,
        tagName: aNode.tagName,
        directives: (new IndexedList()).concat(aNode.directives)
    });
    var elseANode = aNode.elseANode;

    newANode.directives.remove('if');

    var htmlBuffer = new HTMLJoinBuffer();
    htmlBuffer.addRaw('if (' + compileHelper.expr(ifDirective.value) + ') {\n');
    htmlBuffer.addRaw(compileJSSource(newANode, owner, {
        prop: ' san-if="' + escapeHTML(ifDirective.raw) + '"'
    }));
    if (aNode.elseANode) {
        htmlBuffer.addStringLiteral(serializeStump('else', serializeANode(elseANode)));
    }
    htmlBuffer.addRaw('}\nelse {\n');
    htmlBuffer.addStringLiteral(serializeStump('if', serializeANode(aNode)));
    if (elseANode) {
        var newElseANode = new ANode({
            childs: elseANode.childs,
            props: elseANode.props,
            events: elseANode.events,
            tagName: elseANode.tagName,
            directives: (new IndexedList()).concat(elseANode.directives)
        });

        newElseANode.directives.remove('else');
        htmlBuffer.addRaw(compileJSSource(newElseANode, owner, {
            prop: ' san-else'
        }));
    }
    htmlBuffer.addRaw('}\n');

    return htmlBuffer.toCode();
}

function elseJSSource(aNode, owner) {
    return '';
}

function forJSSource(aNode, owner) {
    var forDirective = aNode.directives.get('for');
    var newANode = new ANode({
        childs: aNode.childs,
        props: aNode.props,
        events: aNode.events,
        tagName: aNode.tagName,
        directives: (new IndexedList()).concat(aNode.directives)
    });

    newANode.directives.remove('for');
    var itemName = forDirective.item.raw;
    var indexName = forDirective.index.raw;
    var listName = compileHelper.dataAccess(forDirective.list);

    var htmlBuffer = new HTMLJoinBuffer();
    htmlBuffer.addRaw('for (var ' + indexName + ' = 0; ' + indexName + ' < ' + listName + '.length; ' + indexName + '++) {\n');
    htmlBuffer.addRaw('data.' + indexName + '=' + indexName + ';\ndata.' + itemName + '= ' + listName + '[' + indexName + '];\n');
    htmlBuffer.addRaw(compileJSSource(newANode, owner, {
        prop: ' san-for="' + escapeHTML(forDirective.raw) + '"'
    }));
    htmlBuffer.addRaw('}\n');
    htmlBuffer.addStringLiteral(serializeStump('for', serializeANode(aNode)));

    return htmlBuffer.toCode();
}

function slotJSSource(aNode, owner) {
    var htmlBuffer = new HTMLJoinBuffer();

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
    htmlBuffer.addStringLiteral(serializeStump('slot-start', '', extraProp));

    if (isGivenContent) {
        htmlBuffer.addRaw('(function (componentCtx) {\n');
    }

    each(childs, function (aNodeChild) {
        htmlBuffer.addRaw(compileJSSource(aNodeChild, owner));
    });

    if (isGivenContent) {
        htmlBuffer.addRaw('})(componentCtx.owner);');
    }

    htmlBuffer.addStringLiteral(serializeStump('slot-stop'));


    return htmlBuffer.toCode();
}

function elementJSSource(aNode, owner, extra) {
    extra = extra || {};
    var htmlBuffer = new HTMLJoinBuffer();
    var tagName = aNode.tagName;
    htmlBuffer.addStringLiteral('<' + tagName);
    aNode.props.each(function (bindInfo) {
        htmlBuffer.addStringLiteral(' prop-' + bindInfo.name + '="' + bindInfo.raw + '"');
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
                    htmlBuffer.addStringLiteral(' ' + prop.name + '="' + prop.expr.value + '"');
                }
                else {
                    htmlBuffer.addStringLiteral(' ' + prop.name + '="');
                    htmlBuffer.addExpr(prop.expr);
                    htmlBuffer.addStringLiteral('"');
                }
                break;
        }
    });
    htmlBuffer.addStringLiteral(extra.prop || '');
    htmlBuffer.addStringLiteral('>');

    // inner content
    // var valueProp = component.props.get('value');
    // if (tagName === 'textarea' && valueProp) {
    //     if (valueProp) {
    //         htmlBuffer.addStringLiteral(valueProp.value);
    //     }
    // }
    // else {

    // }
    mergeIfAndElse(aNode.childs);
    each(aNode.childs, function (aNodeChild) {
        htmlBuffer.addRaw(compileJSSource(aNodeChild, owner));
    });

    if (!autoCloseTags[tagName]) {
        htmlBuffer.addStringLiteral('</' + tagName + '>');
    }

    return htmlBuffer.toCode();
}

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

function HTMLJoinBuffer() {
    this.segs = [];
}

HTMLJoinBuffer.prototype.addRaw = function (str) {
    this.segs.push({
        type: 'RAW',
        code: str
    });
};

HTMLJoinBuffer.prototype.addStringLiteral = function (str) {
    this.segs.push(str);
};

HTMLJoinBuffer.prototype.addDataSerialize = function (prop) {
    this.segs.push({
        prop: prop,
        type: 'DATA_SERIALIZE'
    });
};

HTMLJoinBuffer.prototype.addExpr = function (expr) {
    this.segs.push({
        expr: expr,
        type: 'EXPR'
    });
};



HTMLJoinBuffer.prototype.toCode = function (str) {
    var code = '';
    var temp = '';
    var inStrLiteral = 0;

    function genStrLiteral() {
        if (temp) {
            code += 'html += ' + compileHelper.stringLiteralize(temp) + ';\n';
        }

        inStrLiteral = 0;
        temp = '';
    }

    each(this.segs, function (seg) {
        if (typeof seg === 'string') {
            inStrLiteral = 1;
            temp += seg;
            return;
        }

        genStrLiteral();
        switch (seg.type) {
            case 'DATA_SERIALIZE':
                code += 'html += JSON.stringify(' + compileHelper.dataAccess(seg.prop) + ');\n'
                break;

            case 'EXPR':
                code += 'html += ' + compileHelper.expr(seg.expr) + ';\n'
                break;

            case 'RAW':
                code += seg.code + '\n';
                break;

        }
    });

    genStrLiteral();

    return code;
};


function componentJSSource(ComponentClass, options) {
    var givenData = [];
    if (options.aNode) {
        options.aNode.props.each(function (prop) {
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
                compileHelper.stringLiteralize(prop.name)
                + ':'
                + compileHelper.expr(expr)
            );
        });
    }

    return 'html += (' + compileComponentToCode(ComponentClass, options) + ')({'
        + givenData.join(',\n') + '}, componentCtx);';
}

function compileComponentToCode(ComponentClass, options) {
    // 先初始化个实例，让模板编译成 ANode，并且能获得初始化数据
    var component = new ComponentClass(options);
    var tagName = component.tagName;

    var htmlBuffer = new HTMLJoinBuffer();



    htmlBuffer.addStringLiteral('<' + tagName);
    component.binds.each(function (bindInfo) {
        htmlBuffer.addStringLiteral(' prop-' + bindInfo.name + '="' + bindInfo.raw + '"');
    });

    if (component.subTag) {
        htmlBuffer.addStringLiteral(' san-component="' + component.subTag + '"');
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
                    htmlBuffer.addStringLiteral(' ' + prop.name + '="' + prop.expr.value + '"');
                }
                else {
                    htmlBuffer.addStringLiteral(' ' + prop.name + '="');
                    htmlBuffer.addExpr(prop.expr);
                    htmlBuffer.addStringLiteral('"');
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
    htmlBuffer.addStringLiteral('>');

    if (!component.owner) {
        htmlBuffer.addStringLiteral('<script type="text/san" san-stump="data">');
        htmlBuffer.addDataSerialize();
        htmlBuffer.addStringLiteral('</script>');
    }

    // inner content
    // var valueProp = component.props.get('value');
    // if (tagName === 'textarea' && valueProp) {
    //     if (valueProp) {
    //         htmlBuffer.addStringLiteral(valueProp.value);
    //     }
    // }
    // else {

    // }
    mergeIfAndElse(component.aNode.childs);
    each(component.aNode.childs, function (aNodeChild) {
        htmlBuffer.addRaw(compileJSSource(aNodeChild, component));
    });

    if (!autoCloseTags[tagName]) {
        htmlBuffer.addStringLiteral('</' + tagName + '>');
    }

    var componentCtx = new ComponentSSRContext(component);
    return componentCompileTemplate.toString()
        .replace('// [[body]]', htmlBuffer.toCode())
        .replace('// [[component-context]]', componentCtx.toCode())
        .replace('componentCompileTemplate', ' ');
};

function ComponentSSRContext(component) {
    this.component = component;
}

ComponentSSRContext.prototype.toCode = function () {
    var code = ['var componentCtx = {'];

    // filters
    code.push('filters: {');
    var filterPrefixComma;
    for (var key in this.component.filters) {
        var filter = this.component.filters[key];
        if (typeof filter === 'function') {
            if (filterPrefixComma) {
                code.push(',');
            }
            filterPrefixComma = 1;
            code.push(key + ': ' + filter.toString());
        }
    }
    code.push('},'),

    code.push('callFilter: function (name, args) {var filter = this.filters[name] || DEFAULT_FILTERS[name];if (typeof filter === "function")return filter.apply(this, args);},');

    // computed
    code.push('computed: {');
    var computedPrefixComma;
    for (var key in this.component.computed) {
        var computed = this.component.computed[key];
        if (typeof computed === 'function') {
            if (computedPrefixComma) {
                code.push(',');
            }
            computedPrefixComma = 1;
            code.push(key + ': ' + computed.toString());
        }
    }
    code.push('},'),

    // data
    code.push('data: ' + JSON.stringify(this.component.data.get()) + ',');

    // tagName
    code.push('tagName: "' + this.component.tagName + '"');
    code.push('};');

    return code.join('\n');
};

function componentCompileTemplate(data, parentCtx) {
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

    // var componentCtx;
    // [[component-context]]

    componentCtx.owner = parentCtx;
    data = extend(componentCtx.data, data);

    var html = '';
    // html += attr(tagName, 'value', data.dd);
    // [[body]]

    return html;
}

exports = module.exports = compileJSSource;
