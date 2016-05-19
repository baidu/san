// define(function () {

    function IndexedList() {
        this.raw = [];
        this.index = {};
    }

    IndexedList.prototype.push = function (item) {
        if (!item.name) {
            throw new Error('Object must have "name" property');
        }

        if (!this.index[item.name]) {
            this.raw.push(item);
            this.index[item.name] = item;
        }
    }

    IndexedList.prototype.getByIndex = function (index) {
        return this.raw[index];
    }

    IndexedList.prototype.getByName = function (name) {
        return this.index[name];
    };

    IndexedList.prototype.each = function (iterator) {
        for (var i = 0, l = this.raw.length; i < l; i++) {
            iterator.call(this, this.raw[i], i);
        }
    };

    IndexedList.prototype.removeByIndex = function (index) {
        var name = this.raw[index].name;
        delete this.index[name];
        this.raw.splice(index, 1);
    };

    IndexedList.prototype.removeByName = function (name) {
        delete this.index[name];

        var len = this.raw.length;
        while (len--) {
            if (this.raw[len].name === name) {
                this.raw.splice(len, 1);
                break;
            }
        }
    };

    function each(array, iterator) {
        if (array && array.length > 0) {
            for (var i = 0, l = array.length; i < l; i++) {
                iterator.call(array, array[i], i);
            }
        }
    }


    var NodeType = {
        ELEMENT: 1,
        TEXT: 2
    };

    var BindType = {
        PROP: 1,
        EVENT: 2
    };

    var ExprType = {
        STRING: 1,
        NUMBER: 2,
        IDENT: 3,
        PROP_ACCESSOR: 4,
        INTERPOLATION: 5,
        CALL: 6,
        TEXT: 7
    };


    /**
     * 解析 template
     *
     * @inner
     * @param {string} source template 源码
     * @return {node.Root}
     */
    function parseTemplate(source) {
        var rootNode = {childs: []};
        if (typeof source !== 'string') {
            return rootNode;
        }

        source = source.replace(/<!--([\s\S]*?)-->/mg, '');
        var walker = new Walker(source);

        var tagReg = /<(\/)?([a-z0-9-]+)\s*/ig;
        var attrReg = /([-:0-9a-z\(\)\[\]]+)(=(['"])([^\3]+?)\3)?\s*/ig;

        var tagMatch;
        var currentNode = rootNode;
        var beforeLastIndex = 0;

        while ((tagMatch = walker.match(tagReg)) != null) {
            var tagEnd = tagMatch[1];
            var tagName = tagMatch[2].toLowerCase();

            pushTextNode(source.slice(
                beforeLastIndex,
                walker.currentIndex() - tagMatch[0].length
            ));

            // 62: >
            // 47: /
            if (tagEnd && walker.currentCode() === 62) {
                // 满足关闭标签的条件时，关闭标签
                // 向上查找到对应标签，找不到时忽略关闭
                var closeTargetNode = currentNode;
                while (closeTargetNode && closeTargetNode.tagName !== tagName) {
                    closeTargetNode = closeTargetNode.parent;
                }

                closeTargetNode && (currentNode = closeTargetNode.parent);
                walker.go(1);
            }
            else if (!tagEnd) {
                var element = {
                    type: NodeType.ELEMENT,
                    tagName: tagName,
                    directives: new IndexedList(),
                    binds: new IndexedList(),
                    childs: [],
                    parent: currentNode
                };
                var tagClose = util.tagIsAutoClose(tagName);

                // 解析 attributes
                while (1) {
                    var nextCharCode = walker.currentCode();

                    // 标签结束时跳出 attributes 读取
                    // 标签可能直接结束或闭合结束
                    if (nextCharCode === 62) {
                        walker.go(1);
                        break;
                    }
                    else if (nextCharCode === 47
                        && walker.charCode(walker.currentIndex() + 1) === 62
                    ) {
                        walker.go(2);
                        tagClose = true;
                        break;
                    }

                    // 读取 attribute
                    var attrMatch = walker.match(attrReg);
                    if (attrMatch) {
                        integrateAttr(
                            element,
                            attrMatch[1],
                            attrMatch[2] ? attrMatch[4] : ''
                        );
                    }
                }

                currentNode.childs.push(element);
                if (!tagClose) {
                    currentNode = element;
                }
            }

            beforeLastIndex = walker.currentIndex();
        }

        pushTextNode(walker.cut(beforeLastIndex));

        return rootNode;

        /**
         * 在读取栈中添加文本节点
         *
         * @inner
         * @param {string} 文本内容
         */
        function pushTextNode(text) {
            if (text) {
                currentNode.childs.push({
                    type: NodeType.TEXT,
                    text: text,
                    parent: currentNode
                });
            }
        }

        function integrateAttr(element, name, value) {
            var prefixIndex = name.indexOf('-');
            var prefix;
            var realName;

            if (name === 'id') {
                element.id = value;
            }

            if (prefixIndex > 0) {
                prefix = name.slice(0, prefixIndex);
                realName = name.slice(prefixIndex + 1);
            }

            switch (prefix) {
                case 'on':
                    element.binds.push({
                        type: BindType.EVENT,
                        name: realName,
                        expr: parser.call(value)
                    });
                    break;
                case 'bind':
                    element.binds.push({
                        type: BindType.PROP,
                        name: realName,
                        expr: parser.expr(value)
                    });
                    break;
                case 'san':
                    element.directives.push(parseDirective(realName, value));
                    break;
                default:
                    element.binds.push({
                        type: BindType.PROP,
                        name: name,
                        expr: parser.text(value)
                    });
            }
        }
    }

    var directiveParsers = {
        'for': function (value) {
            var walker = new Walker(value);
            var match = walker.match(/^\s*([\$0-9a-z_]+)(\s*,\s*([\$0-9a-z_]+))?\s+in\s+/ig);

            if (match) {
                return {
                    item: match[1],
                    index: match[3],
                    list: readExpr(walker)
                }
            }

            throw new Error('for syntax error: ' + value);
        }
    };

    function parseDirective(name, value) {
        var parser = directiveParsers[name];
        if (parser) {
            var result = parser(value);
            result.name = name;
            return result;
        }

        return null;
    }

    function Walker(source) {
        this.source = source;
        this.len = this.source.length;
        this.index = 0;
    }

    Walker.prototype.currentCode = function () {
        return this.source.charCodeAt(this.index);
    };

    Walker.prototype.currentIndex = function () {
        return this.index;
    };

    Walker.prototype.cut = function (start, end) {
        return this.source.slice(start, end);
    };

    Walker.prototype.go = function (distance) {
        this.index += distance;
    };

    Walker.prototype.nextCode = function (distance) {
        this.go(1);
        return this.currentCode();
    };

    Walker.prototype.charCode = function (index) {
        return this.source.charCodeAt(index);
    };

    Walker.prototype.goUtil = function (charCode) {
        var code;
        while ((code = this.currentCode())) {
            if (code === 32 || code === 9) {
                this.index++;
            }
            else {
                if (code === charCode) {
                    this.index++;
                    return true;
                }
                return false;
            }
        }
    };

    Walker.prototype.match = function (reg) {
        reg.lastIndex = this.index;

        var match = reg.exec(this.source);
        if (match) {
            this.index = reg.lastIndex;
        }

        return match;
    };

    function readString(walker) {
        var startCode = walker.currentCode();
        var startIndex = walker.currentIndex();
        var char;

        walkLoop: while ((charCode = walker.nextCode())) {
            switch (charCode) {
                case 92: // \
                    walker.go(1);
                    break;
                case startCode:
                    walker.go(1);
                    break walkLoop;
            }
        }

        return {
            type: ExprType.STRING,
            literal: walker.cut(startIndex, walker.currentIndex())
        };
    }

    function readIdentifier(walker) {
        var match = walker.match(/\s*([\$0-9a-z_]+)/ig);
        return {
            type: ExprType.IDENT,
            name: match[1]
        };
    }

    function readNumber(walker) {
        var match = walker.match(/\s*(-?[0-9]+(.[0-9]+)?)/g);

        return {
            type: ExprType.NUMBER,
            literal: match[1]
        };
    }

    function readPropertyAccessor(walker) {
        var result = {
            type: ExprType.PROP_ACCESSOR,
            paths: []
        };

        var firstSeg = readIdentifier(walker);
        if (!firstSeg) {
            return null;
        }

        result.paths.push(firstSeg);
        accessorLoop: while (1) {
            var code = walker.currentCode();

            switch (code) {
                case 46: // .
                    walker.go(1);
                    result.paths.push(readIdentifier(walker));
                    break;

                case 91: // [
                    walker.go(1);
                    result.paths.push(readExpr(walker));
                    walker.goUtil(93);  // ]

                default:
                    break accessorLoop;
            }
        }

        if (result.paths.length === 1) {
            return firstSeg;
        }

        return result;
    }

    function readExpr(walker) {
        walker.goUtil();
        var code = walker.currentCode();
        switch (code) {
            case 34: // "
            case 39: // '
                return readString(walker);
            case 45:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
                return readNumber(walker);
            default:
                return readPropertyAccessor(walker);
        }
    }

    /**
     * 解析文本
     *
     * @inner
     * @param {string} source 源码
     * @return {Array}
     */
    function parseText(source) {
        var exprStartReg = /\{\{\s*([\s\S]+?)\s*\}\}/ig;
        var exprMatch;

        var walker = new Walker(source);
        var segs = [];
        var beforeIndex = 0;
        while ((exprMatch = walker.match(exprStartReg)) != null) {
            var beforeText = walker.cut(
                beforeIndex,
                walker.currentIndex() - exprMatch[0].length
            );

            beforeText && segs.push({
                type: ExprType.STRING,
                value: beforeText
            });
            segs.push(parseInterpolation(exprMatch[1]));
            beforeIndex = walker.currentIndex();
        }

        var tail = walker.cut(beforeIndex);
        tail && segs.push({
            type: ExprType.STRING,
            value: tail
        });

        return {
            type: ExprType.TEXT,
            segs: segs
        };
    }

    function parseInterpolation(source) {
        var walker = new Walker(source);
        var expr = readExpr(walker);

        var filters = [];
        while (walker.goUtil(124)) { // |
            filters.push(readCall(walker));
        }

        return {
            type: ExprType.INTERPOLATION,
            expr: expr,
            filters: filters
        };
    }



    function readCall(walker) {
        walker.goUtil();
        var identifier = readIdentifier(walker);
        var args = [];

        if (walker.goUtil(40)) { // (
            while (!walker.goUtil(41)) { // )
                args.push(readExpr(walker));
                walker.goUtil(44); // ,
            }
        }

        return {
            type: ExprType.CALL,
            name: identifier,
            args: args
        };
    }


    function parseExpr(source) {
        return readExpr(new Walker(source));
    }

    /**
     * 解析调用
     *
     * @inner
     * @param {string} source 源码
     */
    function parseCall(source) {
        return readCall(new Walker(source));
    }

    var parser = {
        template: parseTemplate,
        text: parseText,
        expr: parseExpr,
        call: parseCall
    };

    function evalExpr(expr, component) {

        switch (expr.type) {
            case ExprType.STRING:
            case ExprType.NUMBER:
                if (!expr.value) {
                    expr.value = (new Function('return ' + expr.literal))();
                }
                return expr.value;

            case ExprType.IDENT:
            case ExprType.PROP_ACCESSOR:
                return component.model.get(expr);

            case ExprType.INTERPOLATION:
                var value = component.model.get(expr.expr);
                each(expr.filters, function (filter) {
                    var filterFn = component.filters[filter.name.name];

                    console.log(filter, filterFn)
                    if (typeof filterFn === 'function') {
                        var args = [value];
                        each(filter.args, function (arg) {
                            args.push(evalExpr(arg, component));
                        });

                        value = filterFn.apply(component, args);
                    }
                });
                return value;

            case ExprType.CALL:
                return;

            case ExprType.TEXT:
                var buf = new util.StringBuffer();
                each(expr.segs, function (seg) {
                    buf.push(evalExpr(seg, component));
                });
                return buf.toString();
        }
    }
// });
