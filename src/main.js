/**
 * san-core
 * Copyright 2016 Baidu Inc. All rights reserved.
 *
 * @file 组件体系，vm引擎
 * @author errorrik(errorrik@gmail.com)
 */


/* eslint-disable fecs-max-statements */
(function (root) {
/* eslint-enable fecs-max-statements */

    // #region utils
    /**
     * 对象属性拷贝
     *
     * @inner
     * @param {Object} target 目标对象
     * @param {Object} source 源对象
     * @return {Object} 返回目标对象
     */
    function extend(target, source) {
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }

        return target;
    }

    /**
     * 构建类之间的继承关系
     *
     * @inner
     * @param {Function} subClass 子类函数
     * @param {Function} superClass 父类函数
     */
    function inherits(subClass, superClass) {
        /* jshint -W054 */
        var subClassProto = subClass.prototype;
        var F = new Function();
        F.prototype = superClass.prototype;
        subClass.prototype = new F();
        subClass.prototype.constructor = subClass;
        extend(subClass.prototype, subClassProto);
        /* jshint +W054 */
    }

    /**
     * 遍历数组集合
     *
     * @inner
     * @param {Array} array 数组源
     * @param {function(Any,number):boolean} iterator 遍历函数
     * @param {Object=} thisArg this指向对象
     */
    function each(array, iterator, thisArg) {
        if (array && array.length > 0) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (iterator.call(thisArg || array, array[i], i) === false) {
                    break;
                }
            }
        }
    }

    /**
     * Function.prototype.bind 方法的兼容性封装
     *
     * @inner
     * @param {Function} func 要bind的函数
     * @param {Object} thisArg this指向对象
     * @param {...*} args 预设的初始参数
     * @return {Function}
     */
    function bind(func, thisArg) {
        var nativeBind = Function.prototype.bind;
        var slice = Array.prototype.slice;
        if (nativeBind && func.bind === nativeBind) {
            return nativeBind.apply(func, slice.call(arguments, 1));
        }

        var args = slice.call(arguments, 2);
        return function () {
            func.apply(thisArg, args.concat(slice.call(arguments)));
        };
    }

    /**
     * DOM 事件挂载
     *
     * @inner
     * @param {HTMLElement} el DOM元素
     * @param {string} eventName 事件名
     * @param {Function} listener 监听函数
     */
    function on(el, eventName, listener) {
        if (el.addEventListener) {
            el.addEventListener(eventName, listener, false);
        }
        else {
            el.attachEvent('on' + eventName, listener);
        }
    }

    /**
     * DOM 事件卸载
     *
     * @inner
     * @param {HTMLElement} el DOM元素
     * @param {string} eventName 事件名
     * @param {Function} listener 监听函数
     */
    function un(el, eventName, listener) {
        if (el.addEventListener) {
            el.removeEventListener(eventName, listener, false);
        }
        else {
            el.detachEvent('on' + eventName, listener);
        }
    }

    /**
     * 唯一id的起始值
     *
     * @inner
     * @type {number}
     */
    var guidIndex = 1;

    /**
     * 获取唯一id
     *
     * @inner
     * @return {string} 唯一id
     */
    function guid() {
        return '_san_' + (guidIndex++);
    }

    /**
     * 下一个周期要执行的任务列表
     *
     * @inner
     * @type {Array}
     */
    var nextTasks = [];

    /**
     * 执行下一个周期任务的函数
     *
     * @inner
     * @type {Function}
     */
    var nextHandler;

    /**
     * 在下一个时间周期运行任务
     *
     * @inner
     * @param {Function} fn 要运行的任务函数
     * @param {Object=} thisArg this指向对象
     */
    function nextTick(fn, thisArg) {
        if (thisArg) {
            fn = bind(fn, thisArg);
        }
        nextTasks.push(fn);

        if (nextHandler) {
            return;
        }

        nextHandler = function () {
            var tasks = nextTasks.slice(0);
            nextTasks = [];
            nextHandler = null;

            for (var i = 0, l = tasks.length; i < l; i++) {
                tasks[i]();
            }
        };

        if (typeof MutationObserver === 'function') {
            var num = 1;
            var observer = new MutationObserver(nextHandler);
            var text = document.createTextNode(num);
            observer.observe(text, {
                characterData: true
            });
            text.data = ++num;
        }
        else if (typeof setImmediate === 'function') {
            setImmediate(nextHandler);
        }
        else {
            setTimeout(nextHandler, 0);
        }
    }

    /**
     * ie版本号，非ie时为0
     *
     * @inner
     * @type {number}
     */
    var ie = (function () {
        var ieVersionMatch = typeof navigator !== 'undefined'
            && navigator.userAgent.match(/msie\s*([0-9]+)/i);

        if (ieVersionMatch) {
            return ieVersionMatch[1] - 0;
        }

        return 0;
    })();

    /**
     * 字符串连接时是否使用老式的兼容方案
     *
     * @inner
     * @type {boolean}
     */
    var isCompatStringJoin = ie && ie < 8;

    /**
     * 写个用于跨平台提高性能的字符串连接类
     * 万一不小心支持老式浏览器了呢
     *
     * @inner
     * @class
     */
    function StringBuffer() {
        this.raw = isCompatStringJoin ? [] : '';
    }

    /**
     * 获取连接的字符串结果
     *
     * @inner
     * @return {string}
     */
    StringBuffer.prototype.toString = function () {
        return isCompatStringJoin ? this.raw.join('') : this.raw;
    };

    /**
     * 增加字符串片段
     * 就不支持多参数，别问我为什么，这东西也不是给外部用的
     *
     * @inner
     * @param {string} source 字符串片段
     */
    StringBuffer.prototype.push = isCompatStringJoin
        ? function (source) {
            this.raw.push(source);
        }
        : function (source) {
            this.raw += source;
        };

    /**
     * 索引列表，能根据 item 中的 name 进行索引
     *
     * @inner
     * @class
     */
    function IndexedList() {
        this.raw = [];
        this.index = {};
    }

    /**
     * 在列表末尾添加 item
     *
     * @inner
     * @param {Object} item 要添加的对象
     */
    IndexedList.prototype.push = function (item) {
        if (!item.name) {
            throw new Error('Object must have "name" property');
        }

        if (!this.index[item.name]) {
            this.raw.push(item);
            this.index[item.name] = item;
        }
    };

    /**
     * 根据顺序下标获取 item
     *
     * @inner
     * @param {number} index 顺序下标
     * @return {Object}
     */
    IndexedList.prototype.getAt = function (index) {
        return this.raw[index];
    };

    /**
     * 根据 name 获取 item
     *
     * @inner
     * @param {string} name name
     * @return {Object}
     */
    IndexedList.prototype.get = function (name) {
        return this.index[name];
    };

    /**
     * 遍历 items
     *
     * @inner
     * @param {function(*,Number):boolean} iterator 遍历函数
     * @param {Object} thisArg 遍历函数运行的this环境
     */
    IndexedList.prototype.each = function (iterator, thisArg) {
        each(this.raw, bind(iterator, thisArg || this));
    };

    /**
     * 根据顺序下标移除 item
     *
     * @inner
     * @param {number} index 顺序
     */
    IndexedList.prototype.removeAt = function (index) {
        var name = this.raw[index].name;
        this.index[name] = null;
        this.raw.splice(index, 1);
    };

    /**
     * 根据 name 移除 item
     *
     * @inner
     * @param {string} name name
     */
    IndexedList.prototype.remove = function (name) {
        this.index[name] = null;

        var len = this.raw.length;
        while (len--) {
            if (this.raw[len].name === name) {
                this.raw.splice(len, 1);
                break;
            }
        }
    };

    /**
     * 连接另外一个 IndexedList，返回一个新的 IndexedList
     *
     * @inner
     * @param {IndexedList} other 要连接的IndexedList
     * @return {IndexedList}
     */
    IndexedList.prototype.concat = function (other) {
        var result = new IndexedList();
        each(this.raw.concat(other.raw), function (item) {
            result.push(item);
        });

        return result;
    };

    /**
     * 判断标签是否应自关闭
     *
     * @inner
     * @param {string} tagName 标签名
     * @return {boolean}
     */
    function tagIsAutoClose(tagName) {
        return /^(img|input)$/i.test(tagName);
    }

    // #region parse
    /**
     * 表达式类型
     *
     * @inner
     * @const
     * @type {Object}
     */
    var ExprType = {
        STRING: 1,
        NUMBER: 2,
        IDENT: 3,
        PROP_ACCESSOR: 4,
        INTERPOLATION: 5,
        CALL: 6,
        TEXT: 7,
        BINARY: 8,
        UNARY: 9
    };

    /**
     * 字符串源码读取类，用于模板字符串解析过程
     *
     * @inner
     * @class
     * @param {string} source 要读取的字符串
     */
    function Walker(source) {
        this.source = source;
        this.len = this.source.length;
        this.index = 0;
    }

    /**
     * 获取当前字符码
     *
     * @return {number}
     */
    Walker.prototype.currentCode = function () {
        return this.charCode(this.index);
    };

    /**
     * 获取当前读取位置
     *
     * @return {number}
     */
    Walker.prototype.currentIndex = function () {
        return this.index;
    };

    /**
     * 截取字符串片段
     *
     * @param {number} start 起始位置
     * @param {number} end 结束位置
     * @return {string}
     */
    Walker.prototype.cut = function (start, end) {
        return this.source.slice(start, end);
    };

    /**
     * 向前读取字符
     *
     * @param {number} distance 读取字符数
     */
    Walker.prototype.go = function (distance) {
        this.index += distance;
    };

    /**
     * 读取下一个字符，返回下一个字符的 code
     *
     * @return {number}
     */
    Walker.prototype.nextCode = function () {
        this.go(1);
        return this.currentCode();
    };

    /**
     * 获取相应位置字符的 code
     *
     * @param {number} index 字符位置
     * @return {number}
     */
    Walker.prototype.charCode = function (index) {
        return this.source.charCodeAt(index);
    };

    /**
     * 向前读取字符，直到遇到指定字符再停止
     *
     * @param {number=} charCode 指定字符的code
     * @return {boolean} 当指定字符时，返回是否碰到指定的字符
     */
    Walker.prototype.goUntil = function (charCode) {
        var code;
        while (this.index < this.len && (code = this.currentCode())) {
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

    /**
     * 向前读取符合规则的字符片段，并返回规则匹配结果
     *
     * @param {RegExp} reg 字符片段的正则表达式
     * @return {Array}
     */
    Walker.prototype.match = function (reg) {
        reg.lastIndex = this.index;

        var match = reg.exec(this.source);
        if (match) {
            this.index = reg.lastIndex;
        }

        return match;
    };

    /**
     * 模板解析生成的抽象节点
     *
     * @class
     * @inner
     * @param {Object=} options 节点参数
     * @param {stirng=} options.tagName 标签名
     * @param {ANode=} options.parent 父节点
     * @param {boolean=} options.isText 是否文本节点
     */
    function ANode(options) {
        this.directives = new IndexedList();
        this.binds = new IndexedList();
        this.events = new IndexedList();
        this.childs = [];

        extend(this, options);
    }

    /**
     * 解析 template
     *
     * @inner
     * @param {string} source template 源码
     * @return {node.Root}
     */
    function parseTemplate(source) {
        var rootNode = new ANode();

        if (typeof source !== 'string') {
            return rootNode;
        }

        source = source.replace(/<!--([\s\S]*?)-->/mg, '').replace(/(^\s+|\s+$)/g, '');
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
                var aElement = new ANode({
                    tagName: tagName,
                    parent: currentNode
                });
                var tagClose = tagIsAutoClose(tagName);

                // 解析 attributes

                /* eslint-disable no-constant-condition */
                while (1) {
                /* eslint-enable no-constant-condition */

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
                            aElement,
                            attrMatch[1],
                            attrMatch[2] ? attrMatch[4] : ''
                        );
                    }
                }

                currentNode.childs.push(aElement);
                if (!tagClose) {
                    currentNode = aElement;
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
         * @param {string} text 文本内容
         */
        function pushTextNode(text) {
            if (text) {
                currentNode.childs.push(new ANode({
                    isText: true,
                    text: text,
                    parent: currentNode
                }));
            }
        }
    }

    /**
     * 解析抽象节点属性
     *
     * @inner
     * @param {ANode} aNode 抽象节点
     * @param {string} name 属性名称
     * @param {string} value 属性值
     * @param {boolean=} ignoreNormal 是否忽略无前缀的普通属性
     */
    function integrateAttr(aNode, name, value, ignoreNormal) {
        if (name === 'id') {
            aNode.id = value;
            return;
        }

        var prefixIndex = name.indexOf('-');
        var prefix;
        var realName;

        if (prefixIndex > 0) {
            prefix = name.slice(0, prefixIndex);
            realName = name.slice(prefixIndex + 1);
        }

        switch (prefix) {
            case 'on':
                aNode.events.push({
                    name: realName,
                    expr: parseCall(value)
                });
                break;

            case 'bind':
                aNode.binds.push({
                    name: realName,
                    expr: parseExpr(value)
                });
                break;

            case 'bindx':
                aNode.binds.push({
                    name: realName,
                    expr: parseExpr(value),
                    twoWay: true
                });
                break;

            case 'san':
                var directive = parseDirective(realName, value);
                directive && aNode.directives.push(directive);
                break;

            case 'prop':
                aNode.binds.push(textBindExtra({
                    name: realName,
                    expr: parseText(value)
                }));
                break;

            default:
                if (!ignoreNormal) {
                    aNode.binds.push(textBindExtra({
                        name: name,
                        expr: parseText(value)
                    }));
                }
        }
    }

    /**
     * 为text类型的属性绑定附加额外的行为，用于一些特殊需求，比如class中插值的自动展开
     *
     * @inner
     * @param {Object} 绑定信息
     * @return {Object}
     */
    function textBindExtra(bind) {
        switch (bind.name) {
            case 'class':
                each(bind.expr.segs, function (seg) {
                    if (seg.type === ExprType.INTERPOLATION) {
                        seg.filters.push({
                            type: ExprType.CALL,
                            name: {
                                type: ExprType.IDENT,
                                name: 'join'
                            },
                            args: [
                                {
                                    type: ExprType.STRING,
                                    value: ' '
                                }
                            ]
                        });
                    }
                });
        }

        return bind;
    }

    /**
     * 指令解析器
     *
     * @type {Object}
     * @inner
     */
    var directiveParsers = {
        'for': function (value) {
            var walker = new Walker(value);
            var match = walker.match(/^\s*([\$0-9a-z_]+)(\s*,\s*([\$0-9a-z_]+))?\s+in\s+/ig);

            if (match) {
                return {
                    item: match[1],
                    index: match[3] || '$index',
                    list: readPropertyAccessor(walker)
                };
            }

            throw new Error('for syntax error: ' + value);
        },

        'ref': function (value) {
            return {
                value: parseText(value)
            };
        },

        'if': function (value) {
            return {
                value: parseExpr(value)
            };
        },

        'else': function () {
            return {
                value: true
            };
        }
    };

    /**
     * 解析指令
     *
     * @inner
     * @param {string} name 指令名称
     * @param {string} value 指令值
     * @return {Object}
     */
    function parseDirective(name, value) {
        var parser = directiveParsers[name];
        if (parser) {
            var result = parser(value);
            result.name = name;
            return result;
        }

        return null;
    }

    /**
     * 解析文本
     *
     * @inner
     * @param {string} source 源码
     * @return {Object}
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

    /**
     * 解析差值替换
     *
     * @inner
     * @param {string} source 源码
     * @return {Object}
     */
    function parseInterpolation(source) {
        var walker = new Walker(source);
        var expr = readLogicalORExpr(walker);

        var filters = [];
        while (walker.goUntil(124)) { // |
            filters.push(readCall(walker));
        }

        return {
            type: ExprType.INTERPOLATION,
            expr: expr,
            filters: filters
        };
    }

    /**
     * 解析表达式
     *
     * @inner
     * @param {string} source 源码
     * @return {Object}
     */
    function parseExpr(source) {
        if (typeof source === 'object' && source.type) {
            return source;
        }

        return readLogicalORExpr(new Walker(source));
    }

    /**
     * 解析调用
     *
     * @inner
     * @param {string} source 源码
     * @return {Object}
     */
    function parseCall(source) {
        return readCall(new Walker(source));
    }

    /**
     * 读取字符串
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readString(walker) {
        var startCode = walker.currentCode();
        var startIndex = walker.currentIndex();
        var charCode;

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

    /**
     * 读取ident
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readIdentifier(walker) {
        var match = walker.match(/\s*([\$0-9a-z_]+)/ig);
        return {
            type: ExprType.IDENT,
            name: match[1]
        };
    }

    /**
     * 读取数字
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readNumber(walker) {
        var match = walker.match(/\s*(-?[0-9]+(.[0-9]+)?)/g);

        return {
            type: ExprType.NUMBER,
            literal: match[1]
        };
    }

    /**
     * 读取属性访问表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
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

        /* eslint-disable no-constant-condition */
        accessorLoop: while (1) {
        /* eslint-enable no-constant-condition */

            var code = walker.currentCode();
            switch (code) {
                case 46: // .
                    walker.go(1);
                    result.paths.push(readIdentifier(walker));
                    break;

                case 91: // [
                    walker.go(1);
                    var itemExpr = readLogicalORExpr(walker);
                    if (itemExpr.type === ExprType.IDENT) {
                        itemExpr = {
                            type: ExprType.PROP_ACCESSOR,
                            paths: [itemExpr]
                        };
                    }
                    result.paths.push(itemExpr);
                    walker.goUntil(93);  // ]
                    break;

                default:
                    break accessorLoop;
            }
        }

        if (result.paths.length === 1) {
            return firstSeg;
        }

        return result;
    }

    /**
     * 读取逻辑或表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readLogicalORExpr(walker) {
        var expr = readLogicalANDExpr(walker);
        walker.goUntil();

        if (walker.currentCode() === 124) { // |
            if (walker.nextCode() === 124) {
                walker.go(1);
                return {
                    type: ExprType.BINARY,
                    operator: BinaryOp[248],
                    segs: [expr, readLogicalORExpr(walker)]
                };
            }

            walker.go(-1);
        }

        return expr;
    }

    /**
     * 读取逻辑与表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readLogicalANDExpr(walker) {
        var expr = readEqualityExpr(walker);
        walker.goUntil();

        if (walker.currentCode() === 38) { // &
            if (walker.nextCode() === 38) {
                walker.go(1);
                return {
                    type: ExprType.BINARY,
                    operator: BinaryOp[76],
                    segs: [expr, readLogicalANDExpr(walker)]
                };
            }

            walker.go(-1);
        }

        return expr;
    }

    /**
     * 读取相等比对表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readEqualityExpr(walker) {
        var expr = readRelationalExpr(walker);
        walker.goUntil();

        var code = walker.currentCode();
        switch (code) {
            case 61: // =
            case 33: // !
                if (walker.nextCode() === 61) {
                    code += 61;
                    if (walker.nextCode() === 61) {
                        walker.go(1);
                        code += 61;
                    }

                    return {
                        type: ExprType.BINARY,
                        operator: BinaryOp[code],
                        segs: [expr, readEqualityExpr(walker)]
                    };
                }

                walker.go(-1);
        }

        return expr;
    }

    /**
     * 读取关系判断表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readRelationalExpr(walker) {
        var expr = readAdditiveExpr(walker);
        walker.goUntil();

        var code = walker.currentCode();
        switch (code) {
            case 60: // <
            case 62: // >
                if (walker.nextCode() === 61) {
                    code += 61;
                    walker.go(1);
                }

                return {
                    type: ExprType.BINARY,
                    operator: BinaryOp[code],
                    segs: [expr, readRelationalExpr(walker)]
                };
        }

        return expr;
    }

    /**
     * 读取加法表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readAdditiveExpr(walker) {
        var expr = readMultiplicativeExpr(walker);
        walker.goUntil();

        var code = walker.currentCode();
        switch (code) {
            case 43: // +
            case 45: // -
                walker.go(1);
                return {
                    type: ExprType.BINARY,
                    operator: BinaryOp[code],
                    segs: [expr, readAdditiveExpr(walker)]
                };
        }

        return expr;
    }

    /**
     * 读取乘法表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readMultiplicativeExpr(walker) {
        var expr = readUnaryExpr(walker);
        walker.goUntil();

        var code = walker.currentCode();
        switch (code) {
            case 42: // *
            case 47: // /
                walker.go(1);
                return {
                    type: ExprType.BINARY,
                    operator: BinaryOp[code],
                    segs: [expr, readMultiplicativeExpr(walker)]
                };
        }

        return expr;
    }

    /**
     * 读取一元表达式
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readUnaryExpr(walker) {
        walker.goUntil();

        switch (walker.currentCode()) {
            case 33: // !
                walker.go(1);
                return {
                    type: ExprType.UNARY,
                    expr: readUnaryExpr(walker)
                };
            case 34: // "
            case 39: // '
                return readString(walker);
            case 45: // number
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
            case 40: // (
                return readParenthesizedExpr(walker);
        }

        return readPropertyAccessor(walker);
    }

    function readParenthesizedExpr(walker) {
        walker.go(1);
        var expr = readLogicalORExpr(walker);
        walker.goUntil(41);  // )

        return expr;
    }

    /**
     * 二元表达式操作函数
     *
     * @inner
     * @type {Object}
     */
    var BinaryOp = {
        /* eslint-disable */
        43: function (a, b) {
            return a + b;
        },
        45: function (a, b) {
            return a - b;
        },
        42: function (a, b) {
            return a * b;
        },
        47: function (a, b) {
            return a / b;
        },
        60: function (a, b) {
            return a < b;
        },
        62: function (a, b) {
            return a > b;
        },
        76: function (a, b) {
            return a && b;
        },
        94: function (a, b) {
            return a != b;
        },
        121: function (a, b) {
            return a <= b;
        },
        122: function (a, b) {
            return a == b;
        },
        123: function (a, b) {
            return a >= b;
        },
        155: function (a, b) {
            return a !== b;
        },
        183: function (a, b) {
            return a === b;
        },
        248: function (a, b) {
            return a || b;
        }
        /* eslint-enable     */
    };

    /**
     * 读取调用
     *
     * @inner
     * @param {Walker} walker 源码读取对象
     * @return {Object}
     */
    function readCall(walker) {
        walker.goUntil();
        var identifier = readIdentifier(walker);
        var args = [];

        if (walker.goUntil(40)) { // (
            while (!walker.goUntil(41)) { // )
                args.push(readLogicalORExpr(walker));
                walker.goUntil(44); // ,
            }
        }

        return {
            type: ExprType.CALL,
            name: identifier,
            args: args
        };
    }

    /**
     * 判断多个源表达式路径是否包含目标表达式。任何一个满足条件都为true
     *
     * @inner
     * @param {Array} exprs 多个源表达式
     * @param {Object} changeExpr 目标表达式
     * @param {Model} model 表达式所属数据环境
     * @return {boolean}
     */
    function exprsNeedsUpdate(exprs, changeExpr, model) {
        var result = false;
        each(exprs, function (expr) {
            result = exprNeedsUpdate(expr, changeExpr, model);
            return !result;
        });

        return result;
    }

    /**
     * 判断源表达式路径是否包含目标表达式
     * 用于判断源表达式对应对象是否需要更新
     *
     * @inner
     * @param {Object} expr 源表达式
     * @param {Object} changeExpr 目标表达式
     * @param {Model} model 表达式所属数据环境
     * @return {boolean}
     */
    function exprNeedsUpdate(expr, changeExpr, model) {
        if (changeExpr.type === ExprType.IDENT) {
            changeExpr = {
                type: ExprType.PROP_ACCESSOR,
                paths: [changeExpr]
            };
        }

        switch (expr.type) {
            case ExprType.UNARY:
                return exprNeedsUpdate(expr.expr, changeExpr, model);


            case ExprType.TEXT:
            case ExprType.BINARY:
                return exprsNeedsUpdate(expr.segs, changeExpr, model);


            case ExprType.IDENT:
                return expr.name === changeExpr.paths[0].name;


            case ExprType.INTERPOLATION:
                if (!exprNeedsUpdate(expr.expr, changeExpr, model)) {
                    var result = false;
                    each(expr.filters, function (filter) {
                        result = exprsNeedsUpdate(filter.args, changeExpr, model);
                        return !result;
                    });

                    return result;
                }

                return true;


            case ExprType.PROP_ACCESSOR:
                var paths = expr.paths;
                var changePaths = changeExpr.paths;


                /* eslint-disable no-redeclare */
                var result = true;
                /* eslint-enable no-redeclare */
                for (var i = 0, len = paths.length, changeLen = changePaths.length; i < len; i++) {
                    var pathExpr = paths[i];

                    if (pathExpr.type === ExprType.PROP_ACCESSOR
                        && exprNeedsUpdate(pathExpr, changeExpr, model)
                    ) {
                        return true;
                    }

                    if (result && i < changeLen
                        /* eslint-disable eqeqeq */
                        && accessorItemValue(pathExpr, model) != accessorItemValue(changePaths[i], model)
                        /* eslint-enable eqeqeq */
                    ) {
                        result = false;
                    }
                }

                return result;
        }

        return false;
    }


    // #region Model

    /**
     * 数据容器类
     *
     * @inner
     * @class
     * @param {Model} parent 父级数据容器
     */
    function Model(parent) {
        this.parent = parent;
        this.listeners = [];
        this.data = {};
    }

    Model.ChangeType = {
        SET: 1,
        ARRAY_PUSH: 2,
        ARRAY_POP: 3,
        ARRAY_SHIFT: 4,
        ARRAY_UNSHIFT: 5,
        ARRAY_REMOVE: 6
    };

    /**
     * 添加数据变更的事件监听器
     *
     * @param {Function} listener 监听函数
     */
    Model.prototype.onChange = function (listener) {
        if (typeof listener === 'function') {
            this.listeners.push(listener);
        }
    };

    /**
     * 移除数据变更的事件监听器
     *
     * @param {Function} listener 监听函数
     */
    Model.prototype.unChange = function (listener) {
        var len = this.listeners.length;
        while (len--) {
            if (this.listeners[len] === listener) {
                this.listeners.splice(len, 1);
            }
        }
    };

    /**
     * 触发数据变更
     *
     * @param {Object} change 变更信息对象
     */
    Model.prototype.fireChange = function (change) {
        for (var i = 0; i < this.listeners.length; i++) {
            this.listeners[i].call(this, change);
        }
    };

    /**
     * 获取数据项
     *
     * @param {string|Object} expr 数据项路径
     * @return {*}
     */
    Model.prototype.get = function (expr) {
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }

        var value = null;

        switch (expr.type) {
            case ExprType.IDENT:
                value = this.data[expr.name];
                break;

            case ExprType.PROP_ACCESSOR:
                var paths = expr.paths;
                value = this.data[paths[0].name];

                for (var i = 1, l = paths.length; value != null && i < l; i++) {
                    var path = paths[i];
                    var pathValue = accessorItemValue(path, this);
                    value = value[pathValue];
                }
        }

        if (value == null && this.parent) {
            return this.parent.get(expr);
        }

        return value;
    };

    /**
     * 设置数据项
     *
     * @param {string|Object} expr 数据项路径
     * @param {*} value 数据值
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.set = function (expr, value, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }

        var data = this.data;
        var prop;

        switch (expr.type) {
            case ExprType.IDENT:
                prop = expr.name;
                break;

            case ExprType.PROP_ACCESSOR:
                var paths = expr.paths;
                for (var i = 0, l = paths.length; i < l - 1; i++) {
                    var path = paths[i];
                    var pathValue = accessorItemValue(path, this);


                    if (data[pathValue] == null) {
                        data[pathValue] = {};
                    }
                    data = data[pathValue];
                }

                prop = accessorItemValue(paths[i], this);
        }

        if (prop != null && (option.force || data[prop] !== value)) {
            data[prop] = value;
            !option.silence && this.fireChange({
                type: Model.ChangeType.SET,
                expr: expr,
                value: value,
                option: option
            });
        }
    };

    /**
     * 数组数据项push操作
     *
     * @param {string|Object} expr 数据项路径
     * @param {*} item 要push的值
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.push = function (expr, item, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            target.push(item);
            !option.silence && this.fireChange({
                expr: expr,
                type: Model.ChangeType.ARRAY_PUSH,
                value: item,
                index: target.length - 1,
                option: option
            });
        }
    };

    /**
     * 数组数据项pop操作
     *
     * @param {string|Object} expr 数据项路径
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.pop = function (expr, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            var value = target.pop();
            !option.silence && this.fireChange({
                expr: expr,
                type: Model.ChangeType.ARRAY_POP,
                value: value,
                index: target.length,
                option: option
            });
        }
    };

    /**
     * 数组数据项shift操作
     *
     * @param {string|Object} expr 数据项路径
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.shift = function (expr, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            var value = target.shift();
            !option.silence && this.fireChange({
                expr: expr,
                type: Model.ChangeType.ARRAY_SHIFT,
                value: value,
                option: option
            });
        }
    };

    /**
     * 数组数据项unshift操作
     *
     * @param {string|Object} expr 数据项路径
     * @param {*} item 要unshift的值
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.unshift = function (expr, item, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            target.unshift(item);
            !option.silence && this.fireChange({
                expr: expr,
                type: Model.ChangeType.ARRAY_UNSHIFT,
                value: item,
                option: option
            });
        }
    };

    /**
     * 数组数据项移除操作
     *
     * @param {string|Object} expr 数据项路径
     * @param {number} index 要移除项的索引
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.removeAt = function (expr, index, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            if (index < 0 || index >= target.length) {
                return;
            }

            var value = target[index];
            target.splice(index, 1);

            !option.silence && this.fireChange({
                expr: expr,
                type: Model.ChangeType.ARRAY_REMOVE,
                value: value,
                index: index,
                option: option
            });
        }
    };

    /**
     * 数组数据项移除操作
     *
     * @param {string|Object} expr 数据项路径
     * @param {*} value 要移除的项
     * @param {Object=} option 设置参数
     * @param {boolean} option.silence 静默设置，不触发变更事件
     */
    Model.prototype.remove = function (expr, value, option) {
        option = option || {};
        if (typeof expr === 'string') {
            expr = parseExpr(expr);
        }
        var target = this.get(expr);

        if (target instanceof Array) {
            var len = target.length;
            while (len--) {
                if (target[len] === value) {
                    this.removeAt(expr, len, option);
                    break;
                }
            }
        }
    };

    /**
     * HTML Filter替换的字符实体表
     *
     * @const
     * @inner
     * @type {Object}
     */
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
     * 默认filter
     *
     * @inner
     * @const
     * @type {Object}
     */
    var DEFAULT_FILTERS = {

        /**
         * HTML转义filter
         *
         * @param {string} source 源串
         * @return {string} 替换结果串
         */
        html: function (source) {
            if (!source) {
                return '';
            }

            return String(source).replace(/[&<>"']/g, htmlFilterReplacer);
        },

        /**
         * URL编码filter
         *
         * @param {string} source 源串
         * @return {string} 替换结果串
         */
        url: encodeURIComponent,

        /**
         * 源串filter，用于在默认开启HTML转义时获取源串，不进行转义
         *
         * @param {string} source 源串
         * @return {string} 替换结果串
         */
        raw: function (source) {
            return source;
        },

        yesToBe: function (condition, value) {
            if (condition) {
                return value;
            }

            return '';
        },

        yesOrNoToBe: function (condition, yesValue, noValue) {
            return condition ? yesValue : noValue;
        },

        join: function (source, separator) {
            if (source instanceof Array) {
                return source.join(separator);
            }
            return source;
        }
    };

    /**
     * 获取property accessor单项对应的名称值
     *
     * @inner
     * @param {Object} expr 单项的表达式
     * @param {Model} model 数据对象
     * @return {string}
     */
    function accessorItemValue(expr, model) {
        return expr.type === ExprType.IDENT
            ? expr.name
            : evalExpr(expr, model);
    }

    /**
     * 计算表达式的值
     *
     * @inner
     * @param {Object} expr 表达式对象
     * @param {Model} model 数据容器对象
     * @param {Component=} owner 所属组件环境
     * @return {*}
     */
    function evalExpr(expr, model, owner) {
        switch (expr.type) {
            case ExprType.UNARY:
                return !evalExpr(expr.expr, model, owner);

            case ExprType.BINARY:
                return expr.operator(
                    evalExpr(expr.segs[0], model, owner),
                    evalExpr(expr.segs[1], model, owner)
                );

            case ExprType.STRING:
            case ExprType.NUMBER:
                if (expr.value == null) {
                    expr.value = (new Function('return ' + expr.literal))();
                }
                return expr.value;

            case ExprType.IDENT:
            case ExprType.PROP_ACCESSOR:
                return model.get(expr);

            case ExprType.INTERPOLATION:
                var value = evalExpr(expr.expr, model, owner);
                var filters = expr.filters.length > 0
                    ? expr.filters
                    : [
                        {
                            type: ExprType.CALL,
                            name: {
                                type: ExprType.IDENT,
                                name: 'html'
                            },
                            args: []
                        }
                    ];


                owner && each(filters, function (filter) {
                    var filterName = filter.name.name;
                    /* eslint-disable no-use-before-define */
                    var filterFn = owner.filters[filterName] || DEFAULT_FILTERS[filterName];
                    /* eslint-enable no-use-before-define */

                    if (typeof filterFn === 'function') {
                        var args = [value];
                        each(filter.args, function (arg) {
                            args.push(evalExpr(arg, model, owner));
                        });

                        value = filterFn.apply(owner, args);
                    }
                });

                if (value == null) {
                    value = '';
                }

                return value;

            case ExprType.TEXT:
                var buf = new StringBuffer();
                each(expr.segs, function (seg) {
                    buf.push(evalExpr(seg, model, owner));
                });
                return buf.toString();
        }
    }


    // #region node

    /**
     * 创建节点的工厂方法
     *
     * @inner
     * @param {ANode} aNode 抽象节点
     * @param {Node} parent 父亲节点
     * @param {Model=} scope 所属数据环境
     * @return {Node}
     */
    function createNode(aNode, parent, scope) {
        var owner = parent instanceof Component ? parent : parent.owner;
        scope = scope || (parent instanceof Component ? parent.data : parent.scope);
        var options = {
            aNode: aNode,
            owner: owner,
            scope: scope,
            parent: parent
        };

        if (aNode.directives.get('if')) {
            return new IfDirective(options);
        }

        if (aNode.directives.get('else')) {
            return new ElseDirective(options);
        }

        if (aNode.directives.get('for')) {
            return new ForDirective(options);
        }

        if (aNode.isText) {
            return new TextNode(options);
        }

        var ComponentType = owner.components && owner.components[aNode.tagName];
        if (ComponentType) {
            var component = new ComponentType(options);
            return component;
        }

        return new Element(options);
    }

    /* eslint-disable fecs-valid-var-jsdoc */
    /**
     * 节点生命周期信息
     *
     * @inner
     * @type {Object}
     */
    var LifeCycles = {
        inited: {
            name: 'inited',
            value: 1
        },

        compiled: {
            name: 'compiled',
            value: 2
        },

        created: {
            name: 'created',
            value: 3
        },

        attached: {
            name: 'attached',
            value: 4,
            mutex: 'detached'
        },

        detached: {
            name: 'detached',
            value: 5,
            mutex: 'attached'
        },

        disposed: {
            name: 'disposed',
            value: 6,
            mutex: '*'
        }
    };
    /* eslint-enable fecs-valid-var-jsdoc */

    /**
     * 生命周期类
     *
     * @inner
     * @class
     */
    function LifeCycle() {
        this.raw = {};
    }

    /**
     * 设置生命周期
     *
     * @param {string} name 生命周期名称
     */
    LifeCycle.prototype.set = function (name) {
        var lifeCycle = LifeCycles[name];
        if (!lifeCycle) {
            return;
        }

        if (typeof lifeCycle !== 'object') {
            lifeCycle = {
                value: lifeCycle
            };
        }

        if (lifeCycle.mutex) {
            if (lifeCycle.mutex === '*') {
                this.raw = {};
            }
            else {
                this.raw[LifeCycles[lifeCycle.mutex].value] = 0;
            }
        }

        this.raw[lifeCycle.value] = 1;
    };

    /**
     * 是否位于生命周期
     *
     * @param {string} name 生命周期名称
     * @return {boolean}
     */
    LifeCycle.prototype.is = function (name) {
        var lifeCycle = LifeCycles[name];
        if (typeof lifeCycle !== 'object') {
            lifeCycle = {
                value: lifeCycle
            };
        }

        return !!this.raw[lifeCycle.value];
    };

    /**
     * 使节点到达相应的生命周期，并调用钩子
     *
     * @inner
     * @param {Element} source 目标节点
     * @param {string} name 生命周期名称
     */
    function callHook(source, name) {
        if (source.lifeCycle.is(name)) {
            return;
        }

        source.lifeCycle.set(name);

        if (typeof source['_' + name] === 'function') {
            source['_' + name].call(source);
        }

        if (typeof source[name] === 'function') {
            source[name].call(source);
        }

        var hookMethod = source.hooks && source.hooks[name];
        if (hookMethod) {
            hookMethod.call(source);
        }
    }

    /**
     * 节点基类
     *
     * @inner
     * @class
     * @param {Object} options 初始化参数
     * @param {ANode} options.aNode 抽象信息节点对象
     * @param {Component=} options.owner 所属的组件对象
     */
    function Node(options) {
        options = options || {};

        this.lifeCycle = new LifeCycle();
        this.init(options);
    }

    /**
     * 初始化
     *
     * @param {Object} options 初始化参数
     */
    Node.prototype.init = function (options) {
        this._init(options);
        callHook(this, 'inited');
    };

    /**
     * 初始化行为
     *
     * @param {Object} options 初始化参数
     */
    Node.prototype._init = function (options) {
        this.owner = options.owner;
        this.parent = options.parent;
        this.scope = options.scope;
        this.aNode = options.aNode;
        this.el = options.el;

        this.id = (this.el && this.el.id)
            || (this.aNode && this.aNode.id)
            || guid();
    };

    /**
     * 创建完成后的行为
     */
    Node.prototype._created = function () {
        if (!this.el) {
            this.el = document.getElementById(this.id);
        }
    };

    /**
     * 通知自己和childs完成attached状态
     *
     * @protected
     */
    Node.prototype._noticeAttached = function () {
        for (var i = 0, l = this.childs ? this.childs.length : 0; i < l; i++) {
            this.childs[i]._noticeAttached();
        }

        callHook(this, 'created');
        callHook(this, 'attached');
    };

    /**
     * 销毁释放元素
     */
    Node.prototype.dispose = function () {
        this._dispose();
        callHook(this, 'disposed');
    };

    /**
     * 销毁释放元素行为
     */
    Node.prototype._dispose = function () {
        this.el = null;
        this.owner = null;
        this.scope = null;
        this.aNode = null;
        this.parent = null;
    };

    /**
     * 计算表达式的结果
     *
     * @param {Object} expr 表达式对象
     * @return {*}
     */
    Node.prototype.evalExpr = function (expr) {
        return evalExpr(expr, this.scope, this.owner);
    };

    /**
     * 创建桩的html
     *
     * @inner
     * @param {Node} node 节点对象
     * @return {string}
     */
    function genStumpHTML(node) {
        return '<script type="text/san" id="' + node.id + '"></script>';
    }

    function getScriptText(script) {
        // TODO: 兼容性
        return script.textContent;
    }

    /**
     * 文本节点类
     *
     * @inner
     * @class
     * @param {Object} options 初始化参数
     * @param {ANode} options.aNode 抽象信息节点对象
     * @param {Component} options.owner 所属的组件对象
     */
    function TextNode(options) {
        Node.call(this, options);
    }

    inherits(TextNode, Node);

    /**
     * 初始化行为
     *
     * @param {Object} options 初始化参数
     */
    TextNode.prototype._init = function (options) {
        Node.prototype._init.call(this, options);

        if (this.el) {
            this.aNode.isText = true;
            this.aNode.tagName = null;
            this.aNode.text = getScriptText(this.el);
            this.parent._pushChildANode(this.aNode);
        }

        this.expr = parseText(this.aNode.text);
    };

    TextNode.prototype._inited = function () {
        if (this.el) {
            callHook(this, 'created');

            if (this.el.parentNode) {
                if (this.el.previousSibling.nodeType !== 3) {
                    // TODO: create text node and insert before el
                }

                callHook(this, 'attached');
            }
        }
    };

    /**
     * 生成文本节点的HTML
     *
     * @return {string}
     */
    TextNode.prototype.genHTML = function () {
        return (this.evalExpr(this.expr) || ' ') + genStumpHTML(this);
    };

    /**
     * 刷新文本节点的内容
     */
    TextNode.prototype.update = function () {
        var node = this.el.previousSibling;

        if (node) {
            var textProp = typeof node.textContent === 'string' ? 'textContent' : 'data';
            node[textProp] = this.evalExpr(this.expr);
        }

        this.hasUpdateOpInNextTick = 0;
        callHook(this, 'updated');
    };

    /**
     * 绑定数据变化时的视图更新函数
     *
     * @param {Object} change 数据变化信息
     * @return {boolean} 数据的变化是否导致视图需要更新
     */
    TextNode.prototype.updateView = function (change) {
        if (!this.hasUpdateOpInNextTick
            && exprNeedsUpdate(this.expr, change.expr, this.scope)
        ) {
            this.hasUpdateOpInNextTick = 1;
            nextTick(this.update, this);

            return true;
        }
    };

    /**
     * 销毁文本节点
     */
    TextNode.prototype._dispose = function () {
        this.expr = null;
        Node.prototype._dispose.call(this);
    };



    // #region Element

    /**
     * 元素存储对象
     *
     * @inner
     * @type {Object}
     */
    var elementContainer = {};

    /**
     * 元素类
     *
     * @inner
     * @class
     * @param {Object} options 初始化参数
     * @param {ANode} options.aNode 抽象信息节点对象
     * @param {Component} options.owner 所属的组件对象
     */
    function Element(options) {
        this.childs = [];
        // this.listeners = {};
        this.eventListeners = {};
        this._updatedOp = 0;
        this._updateOpCount = 0;

        Node.call(this, options);
    }

    inherits(Element, Node);

    /**
     * 初始化行为
     *
     * @param {Object} options 初始化参数
     */
    Element.prototype._init = function (options) {
        Node.prototype._init.call(this, options);

        if (this.el) {
            this.aNode = parseANodeFromEl(this.el);
            this.parent._pushChildANode(this.aNode);
            this.tagName = this.aNode.tagName;
        }

        elementContainer[this.id] = this;
        this.tagName = this.tagName || (this.aNode && this.aNode.tagName) || 'div';
        this._initPropHandlers();
    };

    /**
     * 初始化完成后的行为
     */
    Element.prototype._inited = function () {
        if (this.el) {
            this.tagName = this.el.tagName.toLowerCase();
            compileChildsFromEl(this);
            callHook(this, 'created');
            if (this.el.parentNode) {
                callHook(this, 'attached');
            }
        }
    };

    /**
     * 创建元素DOM行为
     */
    Element.prototype._create = function () {
        if (!this.el) {
            this.el = document.createElement(this.tagName);
            this.el.id = this.id;

            this.aNode.binds.each(function (bind) {
                var value;
                if (this instanceof Component && bind.expr.type === ExprType.TEXT) {
                    value = evalExpr(bind.expr, this.data, this);
                }
                else {
                    value = this.evalExpr(bind.expr);
                }

                if (value != null && typeof value !== 'object') {
                    this.el.setAttribute(bind.name, value);
                }
            }, this);
        }
    };

    /**
     * 创建元素DOM
     */
    Element.prototype.create = function () {
        if (!this.lifeCycle.is('created')) {
            this._create();
            callHook(this, 'created');
        }
    };

    /**
     * 完成创建元素DOM后的行为
     */
    Element.prototype._created = function () {
        Node.prototype._created.call(this);
        this._initBindx();
        this.bindEvents();
    };

    /**
     * 处理双绑的逻辑
     *
     * @private
     */
    Element.prototype._initBindx = function () {
        this.aNode.binds.each(function (bindInfo) {
            if (!bindInfo.twoWay) {
                return;
            }

            var elTagName = this.el.tagName;
            var elType = this.el.type;

            switch (bindInfo.name) {
                case 'value':
                    switch (elTagName) {
                        case 'INPUT':
                        case 'TEXTAREA':
                            this.on(
                                ('oninput' in this.el) ? 'input' : 'propertychange',
                                bind(bindOutputer, this, bindInfo)
                            );
                            break;

                        case 'SELECT':
                            this.on('change', bind(bindOutputer, this, bindInfo));
                            break;
                    }
                    break;

                case 'checked':
                    if (elTagName === 'INPUT' && (elType === 'checkbox' || elType === 'radio')) {
                        this.on('click', bind(bindOutputer, this, bindInfo));
                    }
                    break;
            }
        }, this);
    };

    function bindOutputer(bindInfo, e) {
        this.blockSetOnce = true;
        var propHandler = this.propHandlers[bindInfo.name] || this.propHandlers['*'];
        propHandler.output(this, bindInfo);
        this.blockSetOnce = false;
    }

    /**
     * 将元素attach到页面
     *
     * @param {HTMLElement} parentEl 要添加到的父元素
     * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
     */
    Element.prototype.attach = function (parentEl, beforeEl) {
        if (!this.lifeCycle.is('attached')) {
            this._attach(parentEl, beforeEl);
            this.bindEvents();
            this._noticeAttached();
        }
    };

    /**
     * 将元素attach到页面的行为
     *
     * @param {HTMLElement} parentEl 要添加到的父元素
     * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
     */
    Element.prototype._attach = function (parentEl, beforeEl) {
        this.create();

        this.el.innerHTML = elementGenChildsHTML(this);

        if (parentEl) {
            if (beforeEl) {
                parentEl.insertBefore(this.el, beforeEl);
            }
            else {
                parentEl.appendChild(this.el);
            }
        }
    };

    /**
     * 元素事件处理函数提供者
     *
     * @inner
     * @type {Object}
     */
    var elementEventProvider = {
        'input': function (element, eventBind) {
            return {
                name: ('oninput' in element.el) ? 'input' : 'propertychange',
                fn: bind(elementInputListener, element, eventBind)
            };
        },

        '*': function (element, eventBind) {
            return {
                name: eventBind.name,
                fn: bind(elementEventListener, element, eventBind)
            };
        }
    };

    /**
     * 表单input事件监听函数
     *
     * @inner
     * @param {Object} eventBind 绑定信息对象
     * @param {Event} e 事件对象
     */
    function elementInputListener(eventBind, e) {
        if (e.type === 'input' || e.propertyName === 'value') {
            e.value = (e.target || e.srcElement).value;
            elementEventListener.call(this, eventBind, e);
        }
    }

    /**
     * 普适事件监听函数
     *
     * @inner
     * @param {Object} eventBind 绑定信息对象
     * @param {Event} e 事件对象
     */
    function elementEventListener(eventBind, e) {
        var args = [];
        var expr = eventBind.expr;

        e = e || window.event;

        each(expr.args, function (argExpr) {
            if (argExpr.type === ExprType.IDENT && argExpr.name === '$event') {
                args.push(e);
            }
            else {
                args.push(this.evalExpr(argExpr));
            }
        }, this);

        var method = this.owner[expr.name.name];
        if (typeof method === 'function') {
            method.apply(this.owner, args);
        }
    }

    /**
     * 绑定事件
     */
    Element.prototype.bindEvents = function () {
        this.aNode.events.each(
            function (eventBind) {
                var provideFn = elementEventProvider[eventBind.name] || elementEventProvider['*'];
                var listener = provideFn(this, eventBind);
                this.on(listener.name, listener.fn);
            },
            this
        );
    };

    /**
     * 解除绑定事件
     */
    Element.prototype.unbindEvents = function () {
        var eventListeners = this.eventListeners;
        var el = this.el;

        for (var key in eventListeners) {
            if (eventListeners.hasOwnProperty(key)) {
                this.un(key);
                eventListeners[key] = null;
            }
        }

        this.eventListeners = null;
    };

    /**
     * 派发事件
     *
     * @param {string} name 事件名
     * @param {Object} event 事件对象
     */
    Element.prototype.fire = function (name, event) {
        each(this.eventListeners[name], function (listener) {
            listener.call(this, event);
        }, this);
    };

    /**
     * 添加事件监听器
     *
     * @param {string} name 事件名
     * @param {Function} listener 监听器
     */
    Element.prototype.on = function (name, listener) {
        if (typeof listener !== 'function') {
            return;
        }

        if (!this.eventListeners[name]) {
            this.eventListeners[name] = [];
        }
        this.eventListeners[name].push(listener);

        on(this.el, name, listener);
    };

    /**
     * 移除事件监听器
     *
     * @param {string} name 事件名
     * @param {Function=} listener 监听器
     */
    Element.prototype.un = function (name, listener) {
        var nameListeners = this.eventListeners[name];
        var len = nameListeners instanceof Array && nameListeners.length;

        while (len--) {
            var fn = nameListeners[len];
            if (!listener || listener === fn) {
                nameListeners.splice(len, 1);
                un(this.el, name, fn);
            }
        }
    };

    /**
     * 生成元素的html
     *
     * @return {string}
     */
    Element.prototype.genHTML = function () {
        var buf = new StringBuffer();

        elementGenStartHTML(this, buf);
        buf.push(elementGenChildsHTML(this));
        elementGenCloseHTML(this, buf);

        // this.bindDataListener();
        return buf.toString();
    };

    /**
     * 生成元素标签起始的html
     *
     * @inner
     * @param {Element} element 元素
     * @param {StringBuffer} stringBuffer html串存储对象
     */
    function elementGenStartHTML(element, stringBuffer) {
        if (!element.tagName) {
            return;
        }

        stringBuffer.push('<');
        stringBuffer.push(element.tagName);
        stringBuffer.push(' id="');
        stringBuffer.push(element.id);
        stringBuffer.push('"');

        element.aNode.binds.each(function (bind) {
            var value;
            if (this instanceof Component && bind.expr.type === ExprType.TEXT) {
                value = evalExpr(bind.expr, this.data, this);
            }
            else {
                value = this.evalExpr(bind.expr);
            }

            var propHandler = this.propHandlers[bind.name] || this.propHandlers['*'];
            stringBuffer.push(propHandler.input.attr(this, bind.name, value));
        }, element);

        stringBuffer.push('>');
    }

    /**
     * 生成元素标签结束的html
     *
     * @inner
     * @param {Element} element 元素
     * @param {StringBuffer} stringBuffer html串存储对象
     */
    function elementGenCloseHTML(element, stringBuffer) {
        var tagName = element.tagName;
        if (!tagName) {
            return;
        }

        if (!tagIsAutoClose(tagName)) {
            stringBuffer.push('</');
            stringBuffer.push(tagName);
            stringBuffer.push('>');
        }
    }

    /**
     * 生成元素的子元素html
     *
     * @inner
     * @param {Element} element 元素
     * @return {string}
     */
    function elementGenChildsHTML(element) {
        var aNode = element.aNode;

        var buf = new StringBuffer();
        for (var i = 0; i < aNode.childs.length; i++) {
            var child = createNode(
                aNode.childs[i],
                element
            );
            element.childs.push(child);
            buf.push(child.genHTML());
        }

        return buf.toString();
    }

    function contains(array, value) {
        var result = false;
        each(array, function (item) {
            result = item === value;
            return !result;
        });

        return result;
    }

    /**
     * 绑定元素的属性设置的变换方法集合
     *
     * @inner
     * @type {Array}
     */
    var bindPropHandlers = [
        // input[type=checkbox] 的 bind handler
        {
            input: {
                attr: function (element, name, value) {
                    var bindValue = element.aNode.binds.get('value');
                    if (bindValue) {
                        var elementValue = element.evalExpr(bindValue.expr);
                        if (contains(value, elementValue)) {
                            return ' checked="checked"';
                        }
                    }

                    return '';
                },

                prop: function (element, name, value) {
                    var bindValue = element.aNode.binds.get('value');
                    if (bindValue) {
                        var elementValue = element.evalExpr(bindValue.expr);
                        if (contains(value, elementValue)) {
                            element.el.checked = true;
                            return;
                        }
                    }

                    element.el.checked = false;
                }
            },

            output: function (element, bindInfo) {
                var el = element.el;
                element.scope[el.checked ? 'push' : 'remove'](bindInfo.expr, el.value);
            },

            choose: function (element) {
                if (element.aNode) {
                    var bindType = element.aNode.binds.get('type');
                    return element.tagName.toLowerCase() === 'input'
                        && bindType && element.evalExpr(bindType.expr) === 'checkbox'
                        && 'checked';
                }
            }
        },

        // input[type=radio] 的 bind handler
        {
            input: {
                attr: function (element, name, value) {
                    var bindValue = element.aNode.binds.get('value');
                    if (bindValue) {
                        var elementValue = element.evalExpr(bindValue.expr)
                        if (value === elementValue) {
                            return ' checked="checked"';
                        }
                    }

                    return '';
                },

                prop: function (element, name, value) {
                    var bindValue = element.aNode.binds.get('value');
                    if (bindValue) {
                        var elementValue = element.evalExpr(bindValue.expr)
                        if (value === elementValue) {
                            element.el.checked = true;
                            return;
                        }
                    }

                    element.el.checked = false;
                }
            },

            output: function (element, bindInfo) {
                var el = element.el;
                element.scope.set(bindInfo.expr, el.checked ? el.value : '');
            },

            choose: function (element) {
                if (element.aNode) {
                    var bindType = element.aNode.binds.get('type');
                    return element.tagName.toLowerCase() === 'input'
                        && bindType && element.evalExpr(bindType.expr) === 'radio'
                        && 'checked';
                }
            }
        },

        // select 的 value bind handler
        {
            input: {
                attr: function (element, name, value) {
                    nextTick(function () {
                        element.el[name] = value;
                    });
                },

                prop: function (element, name, value) {
                    element.el[name] = value;
                }
            },

            output: function (element, bindInfo) {
                element.scope.set(bindInfo.expr, element.el[bindInfo.name]);
            },

            choose: function (element) {
                return element.tagName.toLowerCase() === 'select' && 'value';
            }
        },

        // class 的 bind handler
        {
            input: {
                attr: function (element, name, value) {
                    if (!value) {
                        return '';
                    }

                    return ' class="' + value + '"'
                },

                prop: function (element, name, value) {
                    element.el.className = value;
                }
            },

            choose: function (element) {
                return 'class';
            }
        },

        // style 的 bind handler
        {
            input: {
                attr: function (element, name, value) {
                    if (!value) {
                        return '';
                    }

                    return ' style="' + value + '"';
                },

                prop: function (element, name, value) {
                    element.el.style.cssText = value;
                }
            },

            choose: function (element) {
                return 'style';
            }
        },

        // normal 的 bind handler
        {
            input: {
                attr: function (element, name, value) {
                    if (value == null) {
                        return '';
                    }

                    return ' ' + name + '="' + value + '"';
                },

                prop: function (element, name, value) {
                    element.el[name] = value;
                }
            },

            output: function (element, bindInfo) {
                element.scope.set(bindInfo.expr, element.el[bindInfo.name]);
            },

            choose: function (element) {
                return '*';
            }
        }
    ];

    Element.prototype._initPropHandlers = function () {
        // TODO: clear prop in dispose
        this.propHandlers = {};
        each(
            bindPropHandlers,
            function (propHandler) {
                var name = propHandler.choose(this);
                if (name) {
                    this.propHandlers[name] = propHandler;
                }
            },
            this
        );
    }
    /**
     * 设置元素属性
     *
     * @param {string} name 属性名称
     * @param {*} value 属性值
     */
    Element.prototype.setProp = function (name, value) {
        if (this.el && this.lifeCycle.is('created') && !this.blockSetOnce) {
            var propHandler = this.propHandlers[name] || this.propHandlers['*'];
            propHandler.input.prop(this, name, value);
            this.blockSetOnce = false;
        }
    };

    /**
     * 绑定数据变化时的视图更新函数
     *
     * @param {Object} change 数据变化信息
     * @return {boolean} 数据的变化是否导致视图需要更新
     */
    Element.prototype.updateView = function (change) {
        if (this.lifeCycle.is('disposed')) {
            return;
        }

        var needUpdate = false;
        this.aNode.binds.each(function (bindInfo) {
            if (exprNeedsUpdate(bindInfo.expr, change.expr, this.scope)) {
                nextTick(function () {
                    this.setProp(bindInfo.name, this.evalExpr(bindInfo.expr));
                }, this);
                needUpdate = true;
            }
        }, this);

        each(this.childs, function (child) {
            needUpdate = child.updateView(change) || needUpdate;
        });

        needUpdate && this._noticeUpdatedSoon();
        return needUpdate;
    };

    /**
     * 在 nextTick 注册视图更新操作时，注册触发 updated 钩子的处理函数
     *
     * @private
     */
    Element.prototype._noticeUpdatedSoon = function () {
        this._updateOpCount++;
        nextTick(this._noticeUpdated, this);
    };

    /**
     * 在视图更新结束后，触发 updated 钩子
     *
     * @private
     */
    Element.prototype._noticeUpdated = function () {
        this._updatedOp++;
        if (this._updatedOp >= this._updateOpCount) {
            this._updateOpCount = 0;
            this._updatedOp = 0;

            callHook(this, 'updated');
        }
    };


    /**
     * 将元素从页面上移除
     */
    Element.prototype.detach = function () {
        if (this.lifeCycle.is('attached')) {
            this._detach();
            callHook(this, 'detached');
        }
    };

    /**
     * 将元素从页面上移除的行为
     */
    Element.prototype._detach = function () {
        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    };

    /**
     * 销毁释放元素的行为
     */
    Element.prototype._dispose = function () {
        this.listeners = null;
        this._disposeChilds();
        this.detach();
        this.unbindEvents();

        if (this.valueSynchronizer) {
            un(this.el, this.valueSynchronizerEvent, this.valueSynchronizer);
        }
        this.el = null;
        this.childs = null;
        delete elementContainer[this.id];
        Node.prototype._dispose.call(this);
    };

    /**
     * 销毁释放子元素的行为
     */
    Element.prototype._disposeChilds = function () {
        each(this.childs, function (child) {
            child.dispose();
        });
        this.childs.length = 0;
    };

    Element.prototype._pushChildANode = function (aNode) {
        this.aNode.childs.push(aNode);
    };

    // #region Component

    /**
     * 组件类
     *
     * @class
     * @param {Object} options 初始化参数
     */
    function Component(options) {
        Element.call(this, options);
    }

    inherits(Component, Element);

    /**
     * 初始化
     *
     * @param {Object} options 初始化参数
     */
    Component.prototype.init = function (options) {
        Node.prototype._init.call(this, options);

        this.filters = options.filters || this.filters || {};
        if (!this.owner) {
            this.owner = this;
        }

        // init data
        this.data = new Model();

        var initData = options.data;
        if (!initData && typeof this.initData === 'function') {
            initData = this.initData();
        }

        for (var key in initData) {
            if (initData.hasOwnProperty(key)) {
                this.data.set(key, initData[key]);
            }
        }

        // compile
        this._compile();
        callHook(this, 'compiled');

        this.scope && this.aNode.binds.each(function (bind) {
            this.data.set(bind.name, this.evalExpr(bind.expr));
        }, this);


        callHook(this, 'inited');

        // 如果从el编译的，认为已经attach了，触发钩子
        // TODO: listen in created or attached
        if (this.isCompileFromEl) {
            callHook(this, 'created');
            callHook(this, 'attached');
            this._listenDataChange();
        }
    };

    /**
     * 初始化完成后的行为
     * 清空Element.prototype._inited的行为
     */
    Component.prototype._inited = function () {
    };

    /**
     * 获取带有 san-ref 指令的子组件引用
     *
     * @param {string} name 子组件的引用名
     * @return {Component}
     */
    Component.prototype.ref = function (name) {
        var refComponent = null;
        var owner = this;

        function childsTraversal(element) {
            for (var i = 0, l = element.childs.length; i < l; i++) {
                if (refComponent) {
                    return;
                }

                var child = element.childs[i];

                if (child instanceof Component) {
                    var refDirective = child.aNode.directives.get('ref');
                    if (refDirective
                        && evalExpr(refDirective.value, owner.data, owner) === name
                    ) {
                        refComponent = child;
                        return;
                    }
                }
                else if (child instanceof Element) {
                    childsTraversal(child);
                }
            }
        }

        childsTraversal(owner);
        return refComponent;
    };

    Component.prototype._compileFromEl = function () {
        this.isCompileFromEl = true;
        this.aNode = parseANodeFromEl(this.el);

        this.parent && this.parent._pushChildANode(this.aNode);
        compileChildsFromEl(this);
    };

    function compileChildsFromEl(element) {
        var walker = new DOMChildsWalker(element.el);
        var current;
        while ((current = walker.current)) {
            var child = createNodeByEl(current, element, walker);
            if (child) {
                element.childs.push(child);
            }

            walker.goNext();
        }
    }

    function createNodeByEl(el, parent, elWalker) {
        var owner = parent instanceof Component ? parent : parent.owner;

        // find component class
        var tagName = el.tagName.toLowerCase();
        var ComponentClass = null;

        if (tagName.indexOf('-') > 0) {
            ComponentClass = owner.components[tagName];
        }

        var componentName = el.getAttribute('san-component');
        if (componentName) {
            ComponentClass = owner.components[componentName];
        }

        var option = {
            owner: owner,
            scope: owner.data,
            parent: parent,
            el: el,
            elWalker: elWalker
        };

        // as Component
        if (ComponentClass) {
            return new ComponentClass(option);
        }

        // as normal Element
        var childANode = parseANodeFromEl(el);
        var stumpName = el.getAttribute('san-stump');
        option.aNode = childANode;

        if (childANode.directives.get('if') || stumpName === 'if') {
            return new IfDirective(option);
        }
        else if (childANode.directives.get('else') || stumpName === 'else') {
            return new ElseDirective(option);
        }
        else if (childANode.directives.get('for') || stumpName === 'for') {
            return new ForDirective(option);
        }
        else if (isStump(el)) {
            // as TextNode
            return new TextNode(option);
        }
        else {
            // as Element
            return new Element(option);
        }
    }

    function parseANodeFromEl(el) {
        var aNode = new ANode();
        aNode.tagName = el.tagName.toLowerCase();

        each(
            el.attributes,
            function (attr) {
                integrateAttr(aNode, attr.name, attr.value, true);
            }
        );

        return aNode;
    }

    function isStump(element) {
        return element.tagName === 'SCRIPT' && element.type === 'text/san';
    }

    function DOMChildsWalker(el) {
        this.raw = [];
        this.index = 0;

        var child = el.firstChild;
        while (child) {
            if (child.nodeType === 1) {
                this.raw.push(child);
            }

            child = child.nextSibling;
        }

        this.current = this.raw[this.index];
        this.next = this.raw[this.index + 1];
    }

    DOMChildsWalker.prototype.goNext = function () {
        this.current = this.raw[++this.index];
        this.next = this.raw[this.index + 1];
    };


    /**
     * 模板编译行为
     */
    Component.prototype._compile = function () {
        if (this.lifeCycle.is('compiled')) {
            return;
        }

        if (this.el) {
            this._compileFromEl();
            return;
        }

        // pre compile template
        var proto = this.constructor.prototype;

        if (!proto.aNode) {
            if (proto.template) {
                var aNode = parseTemplate(proto.template);
                var firstChild = aNode.childs[0];

                if (firstChild && !firstChild.isText) {
                    proto.aNode = firstChild;
                    if (firstChild.tagName === 'template') {
                        firstChild.tagName = null;
                    }
                }
                else {
                    throw new Error('[SAN FATEL] template shoule have a root element.');
                }

                proto.template = null;
            }

            proto.aNode = proto.aNode || new ANode();
        }


        var protoANode = proto.aNode;
        if (!this.aNode) {
            this.aNode = protoANode;
        }
        else if (this.aNode !== protoANode) {
            this.aNode.childs = protoANode.childs;

            this.aNode.binds = this.aNode.binds.concat(protoANode.binds);
            this.aNode.directives = this.aNode.directives.concat(protoANode.directives);
            this.aNode.events = this.aNode.events.concat(protoANode.events);
        }


        this.tagName = protoANode.tagName || this.aNode.tagName || 'div';
        // ie8- 不支持innerHTML输出自定义标签
        if (ie && ie < 9 && /^[a-z0-9]+-[a-z0-9]+$/i.test(this.tagName)) {
            this.tagName = 'div';
        }
    };

    /**
     * 处理双绑的逻辑
     *
     * @private
     */
    Component.prototype._initBindx = function () {
        this.aNode.binds.each(function (bindInfo) {
            if (!bindInfo.twoWay) {
                return;
            }

            this.watch(bindInfo.name, function (value) {
                this.scope.set(bindInfo.expr, value);
            });
        }, this);
    };

    /**
     * 监听组件的数据变化
     *
     * @param {string} dataName 变化的数据项
     * @param {Function} listener 监听函数
     */
    Component.prototype.watch = function (dataName, listener) {
        var dataExpr = parseExpr(dataName);
        var me = this;

        this.data.onChange(function (change) {
            if (exprNeedsUpdate(dataExpr, change.expr, this)) {
                listener.call(me, evalExpr(dataExpr, this, me));
            }
        });
    };

    /**
     * 监听数据变化的行为
     *
     * @private
     */
    Component.prototype._listenDataChange = function () {
        if (this.dataChanger) {
            return;
        }

        this.dataChanger = bind(this._dataChanger, this);
        this.data.onChange(this.dataChanger);
    };

    /**
     * 组件内部监听数据变化的函数
     *
     * @private
     * @param {Object} change 数据变化信息
     */
    Component.prototype._dataChanger = function (change) {
        if (this.lifeCycle.is('disposed')) {
            return;
        }

        var needUpdate = false;

        this.aNode.binds.each(function (bind) {
            if (bind.expr.type === ExprType.TEXT) {
                nextTick(function () {
                    this.setProp(bind.name, evalExpr(bind.expr, this.data, this));
                }, this);
            }
        }, this);

        each(this.childs, function (child) {
            needUpdate = child.updateView(change) || needUpdate;
        });

        needUpdate && this._noticeUpdatedSoon();
    };

    /**
     * 移除数据变化的行为的监听
     *
     * @private
     */
    Component.prototype._unlistenDataChange = function () {
        if (this.dataChanger) {
            this.data.unChange(this.dataChanger);
            this.dataChanger = null;
        }
    };

    /**
     * 绑定数据变化时的视图更新函数
     *
     * @param {Object} change 数据变化信息
     * @return {boolean} 数据的变化是否导致视图需要更新
     */
    Component.prototype.updateView = function (change) {
        if (!this.lifeCycle.is('disposed') && this !== this.owner) {
            var needUpdate = false;

            this.aNode.binds.each(function (bind) {
                // if (bind.expr.type === ExprType.TEXT) {
                //     this.setProp(bind.name, evalExpr(bind.expr, this.data, this));
                // }
                // else
                if (exprNeedsUpdate(bind.expr, change.expr, this.scope)) {
                    this.data.set(
                        bind.name,
                        this.evalExpr(bind.expr),
                        {force: true}
                    );
                    needUpdate = true;
                }
            }, this);

            return needUpdate;
        }
    };


    /**
     * 将元素attach到页面的行为
     *
     * @param {HTMLElement} parent 要添加到的父元素
     */
    Component.prototype._attached = function (parent) {
        this._listenDataChange();
    };

    /**
     * 组件销毁的行为
     */
    Component.prototype._dispose = function () {
        this._unlistenDataChange();
        Element.prototype._dispose.call(this);
    };

    /**
     * if 指令处理类
     *
     * @class
     * @param {Object} options 初始化参数
     */
    function IfDirective(options) {
        Element.call(this, options);
    }

    inherits(IfDirective, Element);

    function createIfDirectiveChild(ifElement) {
        var aNode = ifElement.aNode;
        var childANode = new ANode({
            text: aNode.text,
            isText: aNode.isText,
            childs: aNode.childs,
            binds: aNode.binds,
            events: aNode.events,
            tagName: aNode.tagName
        });

        ifElement.aNode.directives.each(function (directive) {
            if (directive.name !== 'if') {
                childANode.directives.push(directive);
            }
        });

        return createNode(childANode, ifElement);
    }

    /**
     * 初始化行为
     *
     * @param {Object} options 初始化参数
     */
    IfDirective.prototype._init = function (options) {
        Node.prototype._init.call(this, options);


        if (options.el) {
            if (options.el.getAttribute('san-stump') === 'if') {
                var aNode = parseTemplate(getScriptText(options.el));
                aNode = aNode.childs[0];
                this.aNode = aNode;
                this.tagName = this.aNode.tagName;
            }
            else {
                this.el = null;
                this._create();
                options.el.parentNode.insertBefore(this.el, options.el.nextSibling);

                options.el.removeAttribute('san-if');
                var child = createNodeByEl(options.el, this, options.elWalker);

                this.childs.push(child);
                this.aNode.childs = child.aNode.childs.slice(0);
            }

            if (options.ifDirective) {
                this.aNode.directives.push(options.ifDirective);
            }

            this.parent._pushChildANode(this.aNode);
        }

        elementContainer[this.id] = this;
    };

    IfDirective.prototype._pushChildANode = function () {};

    /**
     * 创建元素DOM行为
     */
    IfDirective.prototype._create = function () {
        if (!this.el) {
            this.el = document.createElement('script');
            this.el.type = 'text/san';
            this.el.id = this.id;
        }
    };

    /**
     * 初始化完成后的行为
     */
    IfDirective.prototype._inited = function () {
        if (this.el) {
            callHook(this, 'created');
            if (this.el.parentNode) {
                callHook(this, 'attached');
            }
        }
    };

    /**
     * 生成html
     *
     * @return {string}
     */
    IfDirective.prototype.genHTML = function () {
        var buf = new StringBuffer();
        var ifDirective = this.aNode.directives.get('if');
        if (this.evalExpr(ifDirective.value)) {
            var child = createIfDirectiveChild(this);
            this.childs.push(child);
            buf.push(child.genHTML());
        }
        buf.push(genStumpHTML(this));

        return buf.toString();
    };

    /**
     * 绑定数据变化时的视图更新函数
     *
     * @param {Object} change 数据变化信息
     * @return {boolean} 数据的变化是否导致视图需要更新
     */
    IfDirective.prototype.updateView = function (change) {
        if (this.lifeCycle.is('disposed')) {
            return;
        }

        var ifExpr = this.aNode.directives.get('if').value;
        var child = this.childs[0];
        if (exprNeedsUpdate(ifExpr, change.expr, this.scope)) {
            nextTick(function () {
                if (this.lifeCycle.is('disposed')) {
                    return;
                }

                var isChildExists = !!this.evalExpr(ifExpr);

                if (isChildExists) {
                    if (!child) {
                        child = createIfDirectiveChild(this);
                        child.attach(this.el.parentNode, this.el);
                        this.childs[0] = child;
                    }
                }
                else {
                    child && child.dispose();
                    this.childs.length = 0;
                }
            }, this);

            return true;
        }

        return child && child.updateView(change);
    };

    /**
     * 通知自己和子元素完成attached状态
     *
     * @protected
     */
    IfDirective.prototype._noticeAttached = function () {
        var ifDirective = this.aNode.directives.get('if');
        if (this.evalExpr(ifDirective.value)) {
            this.childs[0]._noticeAttached();
        }

        callHook(this, 'created');
        callHook(this, 'attached');
    };

    function ElseDirective(options) {
        var parentChilds = options.parent.childs;
        var len = parentChilds.length;
        while (len--) {
            var child = parentChilds[len];
            if (child instanceof TextNode) {
                continue;
            }

            if (child instanceof IfDirective) {
                var directiveValue = {
                    name: 'if',
                    value: {
                        type: ExprType.UNARY,
                        expr: child.aNode.directives.get('if').value
                    }
                };
                options.aNode.directives.push(directiveValue);
                options.aNode.directives.remove('else');

                if (options.el) {
                    if (isStump(options.el)) {
                        options.el.setAttribute('san-stump', 'if');
                    }
                    else {
                        options.el.removeAttribute('san-else');
                    }
                }

                options.ifDirective = directiveValue;
                return new IfDirective(options);
            }

            break;
        }

        throw new Error('[SAN FATEL] else not match if.');
    }

    /**
     * for 指令处理类
     *
     * @class
     * @param {Object} options 初始化参数
     */
    function ForDirective(options) {
        Element.call(this, options);
    }

    inherits(ForDirective, Element);


    ForDirective.prototype._pushChildANode = function () {};

    /**
     * 生成html
     *
     * @return {string}
     */
    ForDirective.prototype.genHTML = function () {
        var buf = new StringBuffer();

        eachForData(this, function (item, i) {
            var child = createForDirectiveChild(this, item, i);
            this.childs.push(child);
            buf.push(child.genHTML());
        });

        buf.push('<');
        buf.push(this.tagName);

        buf.push(' id="');
        buf.push(this.id);
        buf.push('" style="display:none">');

        if (!tagIsAutoClose(this.tagName)) {
            buf.push('</');
            buf.push(this.tagName);
            buf.push('>');
        }

        return buf.toString();
    };

    /**
     * 初始化行为
     *
     * @param {Object} options 初始化参数
     */
    ForDirective.prototype._init = function (options) {
        Node.prototype._init.call(this, options);


        if (options.el) {
            this.el = null;

            while (1) {
                var current = options.elWalker.current;
                if (current.getAttribute('san-stump') === 'for') {
                    var aNode = parseTemplate(getScriptText(current));
                    aNode = aNode.childs[0];
                    this.aNode = aNode;
                    this.tagName = this.aNode.tagName;
                    this._create();

                    options.el.parentNode.insertBefore(this.el, current);
                    options.el.parentNode.removeChild(current);
                    break;
                }
                else {
                    current.removeAttribute('san-for');
                    var child = createNodeByEl(current, this, options.elWalker);
                    this.childs.push(child);
                }

                var next = options.elWalker.next;
                if (next && (next.getAttribute('san-for') || next.getAttribute('san-stump') === 'for')) {
                    options.elWalker.goNext();
                }
                else {
                    break;
                }
            }

            this.parent._pushChildANode(this.aNode);
        }

        elementContainer[this.id] = this;
    };

    /**
     * 初始化完成后的行为
     */
    ForDirective.prototype._inited = function () {
        if (this.el) {
            callHook(this, 'created');
            if (this.el.parentNode) {
                callHook(this, 'attached');
            }
        }
    };

    /**
     * 将元素attach到页面的行为
     *
     * @param {HTMLElement} parentEl 要添加到的父元素
     * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
     */
    ForDirective.prototype._attach = function (parentEl, beforeEl) {
        this.create();
        if (parentEl) {
            if (beforeEl) {
                parentEl.insertBefore(this.el, beforeEl);
            }
            else {
                parentEl.appendChild(this.el);
            }
        }

        var buf = new StringBuffer();

        eachForData(this, function (item, i) {
            var child = createForDirectiveChild(this, item, i);
            this.childs.push(child);
            buf.push(child.genHTML());
        });
        this.el.insertAdjacentHTML('beforebegin', buf.toString());
    };

    /**
     * 将元素从页面上移除的行为
     */
    ForDirective.prototype._detach = function () {
        each(this.childs, function (child) {
            child.dispose();
        });
        this.childs.length = 0;

        if (this.el && this.el.parentNode) {
            this.el.parentNode.removeChild(this.el);
        }
    };

    /**
     * 创建元素DOM行为
     */
    ForDirective.prototype._create = function () {
        if (!this.el) {
            this.el = document.createElement(this.tagName);
            this.el.id = this.id;
            this.el.style.display = 'none';
        }
    };

    /**
     * 遍历 for 指令表达式的对应数据
     *
     * @inner
     * @param {ForDirective} forElement for 指令元素对象
     * @param {Function} fn 遍历函数
     */
    function eachForData(forElement, fn) {
        var forDirective = forElement.aNode.directives.get('for');
        each(forElement.evalExpr(forDirective.list), fn, forElement);
    }

    /**
     * 创建 for 指令元素的子元素
     *
     * @inner
     * @param {ForDirective} forElement for 指令元素对象
     * @param {*} item 子元素对应数据
     * @param {number} index 子元素对应序号
     * @return {Element}
     */
    function createForDirectiveChild(forElement, item, index) {
        var forDirective = forElement.aNode.directives.get('for');
        var itemScope = new Model(forElement.scope);
        itemScope.set(forDirective.item, item);
        itemScope.set(forDirective.index, index);

        function exprResolve(expr) {
            var resolvedExpr = expr;
            var firstPath;

            switch (expr.type) {
                case ExprType.IDENT:
                    firstPath = expr;
                    break;
                case ExprType.PROP_ACCESSOR:
                    firstPath = expr.paths[0];
                    break;
            }

            if (firstPath && firstPath.name === forDirective.item) {
                resolvedExpr = {
                    type: ExprType.PROP_ACCESSOR,
                    paths: forDirective.list.type === ExprType.PROP_ACCESSOR
                        ? forDirective.list.paths.slice(0)
                        : [forDirective.list]
                };
                resolvedExpr.paths.push({
                    type: ExprType.NUMBER,
                    value: itemScope.get(forDirective.index)
                });

                if (expr.type === ExprType.PROP_ACCESSOR) {
                    resolvedExpr.paths = resolvedExpr.paths.concat(expr.paths.slice(1));
                }
            }

            return resolvedExpr;
        }

        each(['set', 'remove', 'unshift', 'shift', 'push', 'pop'], function (method) {
            var rawFn = forElement.scope[method];
            itemScope[method] = function (expr) {
                expr = exprResolve(parseExpr(expr));
                rawFn.apply(
                    forElement.scope,
                    [expr].concat(Array.prototype.slice.call(arguments, 1))
                );
            };
        });

        var aNode = forElement.aNode;
        return createNode(
            new ANode({
                text: aNode.text,
                isText: aNode.isText,
                childs: aNode.childs,
                binds: aNode.binds,
                events: aNode.events,
                tagName: aNode.tagName
            }),
            forElement,
            itemScope
        );
    }

    /**
     * 绑定数据变化时的视图更新函数
     *
     * @param {Object} change 数据变化信息
     * @return {boolean} 数据的变化是否导致视图需要更新
     */
    ForDirective.prototype.updateView = function (change) {
        if (this.lifeCycle.is('disposed')) {
            return;
        }

        var forDirective = this.aNode.directives.get('for');

        var changeExpr = change.expr;
        var changeSegs = changeExpr.paths;
        if (changeExpr.type === ExprType.IDENT) {
            changeSegs = [changeExpr];
        }
        var changeLen = changeSegs.length;

        var forExpr = forDirective.list;
        var forSegs = forExpr.paths;
        if (forExpr.type === ExprType.IDENT) {
            forSegs = [forExpr];
        }
        var forLen = forSegs.length;

        // changeInForExpr 变量表示变更的数据与 for 指令对应表达式的关系
        // 0 - for 指令对应表达式的“整个数据”发生了变化
        // 1 - for 指令对应表达式的数据的“子项”发生了变化
        // 2 - for 指令对应表达式的数据的“子项的属性”
        // -1 - 变更的不是 for 指令对应表达式的数据
        var changeInForExpr = 0;
        var changeIndex;

        for (var i = 0; i < changeLen && i < forLen; i++) {
            if (accessorItemValue(changeSegs[i]) !== accessorItemValue(forSegs[i])) {
                changeInForExpr = -1;
                break;
            }
        }

        if (changeInForExpr >= 0 && changeLen > forLen) {
            changeIndex = +accessorItemValue(changeSegs[forLen]);
            changeInForExpr = changeLen - forLen === 1 ? 1 : 2;
        }

        var needUpdate = false;

        switch (changeInForExpr) {
            case -1:
                each(this.childs, function (child) {
                    needUpdate = child.updateView(change) || needUpdate;
                });
                break;

            case 0:
                // 对表达式数据本身的数组操作
                // 根据变更类型执行不同的视图更新行为
                switch (change.type) {
                    case Model.ChangeType.ARRAY_PUSH:
                        nextTick(function () {
                            if (this.lifeCycle.is('disposed')) {
                                return;
                            }

                            var newChild = createForDirectiveChild(this, change.value, change.index);
                            this.childs.push(newChild);
                            newChild.attach(this.el.parentNode, this.el);
                        }, this);
                        break;

                    case Model.ChangeType.ARRAY_POP:
                        nextTick(function () {
                            if (this.lifeCycle.is('disposed')) {
                                return;
                            }

                            var index = this.childs.length - 1;
                            this.childs[index].dispose();
                            this.childs.splice(index, 1);
                        }, this);
                        break;

                    case Model.ChangeType.ARRAY_UNSHIFT:
                        nextTick(function () {
                            if (this.lifeCycle.is('disposed')) {
                                return;
                            }

                            var newChild = createForDirectiveChild(this, change.value, 0);
                            var nextChild = this.childs[0] || this;
                            this.childs.unshift(newChild);
                            newChild.attach(nextChild.el.parentNode, nextChild.el);
                        }, this);
                        updateForDirectiveIndex(this, 0, function (i) {
                            return i + 1;
                        });
                        break;

                    case Model.ChangeType.ARRAY_SHIFT:
                        nextTick(function () {
                            if (this.lifeCycle.is('disposed')) {
                                return;
                            }

                            this.childs[0].dispose();
                            this.childs.splice(0, 1);
                        }, this);
                        updateForDirectiveIndex(this, 1, function (i) {
                            return i - 1;
                        });
                        break;

                    case Model.ChangeType.ARRAY_REMOVE:
                        nextTick(function () {
                            if (this.lifeCycle.is('disposed')) {
                                return;
                            }

                            this.childs[change.index].dispose();
                            this.childs.splice(change.index, 1);
                        }, this);
                        updateForDirectiveIndex(this, change.index, function (i) {
                            return i - 1;
                        });
                        break;

                    case Model.ChangeType.SET:
                        // 重新构建整个childs
                        nextTick(function () {
                            if (this.lifeCycle.is('disposed')) {
                                return;
                            }

                            this._disposeChilds();
                            var buf = new StringBuffer();
                            eachForData(this, function (item, i) {
                                var child = createForDirectiveChild(this, item, i);
                                this.childs.push(child);
                                buf.push(child.genHTML());
                            });

                            this.el.insertAdjacentHTML('beforebegin', buf.toString());
                            this._noticeAttached();
                        }, this);
                }

                needUpdate = true;
                break;

            case 1:
            case 2:
                if (change.type === Model.ChangeType.SET) {
                    change = extend({}, change);
                    change.expr = {
                        type: ExprType.PROP_ACCESSOR,
                        paths: [
                            {name: forDirective.item, type: ExprType.IDENT}
                        ].concat(changeSegs.slice(forLen + 1))
                    };
                    Model.prototype.set.call(
                        this.childs[changeIndex].scope,
                        change.expr,
                        change.value,
                        {silence: true}
                    );
                    this.childs[changeIndex].updateView(change);
                    needUpdate = true;
                }
                break;
        }

        needUpdate && this._noticeUpdatedSoon();
        return needUpdate;
    };

    /**
     * 更新 for 指令元素子组件的索引值
     *
     * @inner
     * @param {ForDirective} forDirective for 指令元素
     * @param {number} start 开始的索引
     * @param {function(number):number} fn 计算更新后值的函数
     */
    function updateForDirectiveIndex(forDirective, start, fn) {
        var childs = forDirective.childs;
        var directiveInfo = forDirective.aNode.directives.get('for');

        for (var len = childs.length; start < len; start++) {
            var index = childs[start].scope.get(directiveInfo.index);
            if (index != null) {
                Model.prototype.set.call(
                    childs[start].scope,
                    directiveInfo.index,
                    fn(index)
                );
            }
        }
    }

    // #region exports
    var san = {};

    /**
     * 组件基类
     *
     * @type {Function}
     */
    san.Component = Component;

    /**
     * 创建组件类
     *
     * @param {Object} proto 组件类的方法表
     * @return {Function}
     */
    san.defineComponent = function (proto) {
        function ComponentClass(option) {
            san.Component.call(this, option);
        }

        ComponentClass.prototype = proto
        san.inherits(ComponentClass, san.Component);

        return ComponentClass;
    };

    /**
     * 在下一个更新周期运行函数
     *
     * @param {Function} fn 要运行的函数
     */
    san.nextTick = nextTick;

    /**
     * 注册全局 filter
     *
     * @param {string} name 名称
     * @param {function(*, ...*):*} filter 过滤函数
     */
    san.version = '3.0.0-beta.1';

    /**
     * 根据 DOM id 获取内部元素对象
     *
     * @param {string} id DOM元素的id
     * @return {Element}
     */
    san.getEl = function (id) {
        return elementContainer[id];
    };

    /**
     * 构建类之间的继承关系
     *
     * @param {Function} subClass 子类函数
     * @param {Function} superClass 父类函数
     */
    san.inherits = inherits;

    // export
    if (typeof exports === 'object' && typeof module === 'object') {
        // For CommonJS
        exports = module.exports = san;
    }
    else if (typeof define === 'function' && define.amd) {
        // For AMD
        define([], san);
    }
    else {
        // For <script src="..."
        root.san = san;
    }

})(this);
