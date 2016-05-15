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
                    type: 'element',
                    tagName: tagName,
                    directives: new IndexedList(),
                    events: new IndexedList(),
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

                if (!tagClose) {
                    currentNode.childs.push(element);
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
                    type: 'text',
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
                    element.events.push({
                        type: prefix,
                        name: realName,
                        expr: parser.call(value)
                    });
                    break;
                case 'bind':
                    element.binds.push({
                        type: prefix,
                        name: realName,
                        expr: parser.expr(value)
                    });
                    break;
                case 'san':
                    element.directives.push({
                        type: prefix,
                        name: realName,
                        value: value
                    });
                    break;
                default:
                    element.binds.push({
                        type: 'text',
                        name: name,
                        expr: parser.text(value)
                    });
            }
        }
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
            type: 'String',
            value: walker.cut(startIndex, walker.currentIndex())
        };
    }

    function readIdentifier(walker) {
        var match = walker.match(/\s*([a-z_][0-9a-z_]*)/ig);
        return {
            type: 'Identifier',
            value: match[1]
        };
    }

    function readNumber(walker) {
        var match = walker.match(/\s*(-?[0-9]+(.[0-9]+)?)/g);

        return {
            type: 'Number',
            value: match[1]
        };
    }

    function readPropertyAccessor(walker) {
        var result = {
            type: 'PropertyAccessor',
            value: []
        };

        var firstSeg = readIdentifier(walker);
        if (!firstSeg) {
            return null;
        }

        result.value.push(firstSeg);
        accessorLoop: while (1) {
            var code = walker.currentCode();

            switch (code) {
                case 46: // .
                    walker.go(1);
                    result.value.push(readIdentifier(walker));
                    break;

                case 91: // [
                    walker.go(1);
                    result.value.push(readExpr(walker));
                    walker.goUtil(93);  // ]

                default:
                    break accessorLoop;
            }
        }

        if (result.value.length === 1) {
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
            segs.push(
                walker.cut(
                    beforeIndex,
                    walker.currentIndex() - exprMatch[0].length
                ),
                parseInterpolation(exprMatch[1])
            );
            beforeIndex = walker.currentIndex();
        }

        segs.push(walker.cut(beforeIndex));
        return segs;
    }

    function parseInterpolation(source) {
        var walker = new Walker(source);
        var expr = readExpr(walker);

        var filters = [];
        while (walker.goUtil(124)) { // |
            filters.push(readCall(walker));
        }

        return {
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
// });
