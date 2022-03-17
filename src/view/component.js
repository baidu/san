/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 组件类
 */

var bind = require('../util/bind');
var each = require('../util/each');
var guid = require('../util/guid');
var extend = require('../util/extend');
var nextTick = require('../util/next-tick');
var emitDevtool = require('../util/emit-devtool');
var ExprType = require('../parser/expr-type');
var parseExpr = require('../parser/parse-expr');
var parseTemplate = require('../parser/parse-template');
var unpackANode = require('../parser/unpack-anode');
var removeEl = require('../browser/remove-el');
var Data = require('../runtime/data');
var evalExpr = require('../runtime/eval-expr');
var changeExprCompare = require('../runtime/change-expr-compare');
var DataChangeType = require('../runtime/data-change-type');
var insertBefore = require('../browser/insert-before');
var un = require('../browser/un');
var defineComponent = require('./define-component');
var ComponentLoader = require('./component-loader');
var createNode = require('./create-node');
var preheatEl = require('./preheat-el');
var parseComponentTemplate = require('./parse-component-template');
var preheatANode = require('./preheat-a-node');
var LifeCycle = require('./life-cycle');
var getANodeProp = require('./get-a-node-prop');
var isDataChangeByElement = require('./is-data-change-by-element');
var getEventListener = require('./get-event-listener');
var reverseElementChildren = require('./reverse-element-children');
var NodeType = require('./node-type');
var styleProps = require('./style-props');
var nodeSBindInit = require('./node-s-bind-init');
var nodeSBindUpdate = require('./node-s-bind-update');
var elementOwnAttached = require('./element-own-attached');
var elementOwnOnEl = require('./element-own-on-el');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var warnEventListenMethod = require('./warn-event-listen-method');
var elementDisposeChildren = require('./element-dispose-children');
var createDataTypesChecker = require('../util/create-data-types-checker');
var warn = require('../util/warn');
var handleError = require('../util/handle-error');
var DOMChildrenWalker = require('./dom-children-walker');



/**
 * 组件类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function Component(options) { // eslint-disable-line
    // #[begin] error
    for (var key in Component.prototype) {
        if (this[key] !== Component.prototype[key]) {
            /* eslint-disable max-len */
            warn('\`' + key + '\` is a reserved key of san components. Overriding this property may cause unknown exceptions.');
            /* eslint-enable max-len */
        }
    }
    // #[end]


    options = options || {};
    this.lifeCycle = LifeCycle.start;
    this.id = guid++;

    if (typeof this.construct === 'function') {
        this.construct(options);
    }

    this.children = [];
    this._elFns = [];
    this.listeners = {};
    this.slotChildren = [];
    this.implicitChildren = [];

    var clazz = this.constructor;

    this.filters = this.filters || clazz.filters || {};
    this.computed = this.computed || clazz.computed || {};
    this.messages = this.messages || clazz.messages || {};

    if (options.transition) {
        this.transition = options.transition;
    }

    this.owner = options.owner;
    this.scope = options.scope;
    this.el = options.el;
    var parent = options.parent;
    if (parent) {
        this.parent = parent;
        this.parentComponent = parent.nodeType === NodeType.CMPT
            ? parent
            : parent && parent.parentComponent;
    }
    else if (this.owner) {
        this.parentComponent = this.owner;
        this.scope = this.owner.data;
    }

    this.sourceSlotNameProps = [];
    this.sourceSlots = {
        named: {}
    };

    // #[begin] devtool
    this._toPhase('beforeCompile');
    // #[end]

    var proto = clazz.prototype;

    // pre define components class
    /* istanbul ignore else  */
    if (!proto.hasOwnProperty('_cmptReady')) {
        proto.components = clazz.components || proto.components || {};
        var components = proto.components;

        for (var key in components) { // eslint-disable-line
            var cmptClass = components[key];
            if (typeof cmptClass === 'object' && !(cmptClass instanceof ComponentLoader)) {
                components[key] = defineComponent(cmptClass);
            }
            else if (cmptClass === 'self') {
                components[key] = clazz;
            }
        }

        proto._cmptReady = 1;
    }

    // compile
    if (!proto.hasOwnProperty('aNode')) {
        var aPack = clazz.aPack || proto.hasOwnProperty('aPack') && proto.aPack;
        if (aPack) {
            proto.aNode = unpackANode(aPack);
            clazz.aPack = proto.aPack = null;
        }
        else {
            proto.aNode = parseComponentTemplate(clazz);
        }
    }

    preheatANode(proto.aNode, this);

    this.tagName = proto.aNode.tagName;
    this.source = typeof options.source === 'string'
        ? parseTemplate(options.source).children[0]
        : options.source;

    preheatANode(this.source);
    proto.aNode._i++;


    // #[begin] reverse
    // 组件反解，读取注入的组件数据
    if (this.el) {
        var firstCommentNode = this.el.firstChild;
        if (firstCommentNode && firstCommentNode.nodeType === 3) {
            firstCommentNode = firstCommentNode.nextSibling;
        }

        if (firstCommentNode && firstCommentNode.nodeType === 8) {
            var stumpMatch = firstCommentNode.data.match(/^\s*s-data:([\s\S]+)?$/);
            if (stumpMatch) {
                var stumpText = stumpMatch[1];

                // fill component data
                options.data = (new Function('return '
                    + stumpText
                        .replace(/^[\s\n]*/, '')
                        .replace(
                            /"(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.\d+Z"/g,
                            function (match, y, mon, d, h, m, s) {
                                return 'new Date(' + (+y) + ',' + (+mon) + ',' + (+d)
                                    + ',' + (+h) + ',' + (+m) + ',' + (+s) + ')';
                            }
                        )
                ))();

                if (firstCommentNode.previousSibling) {
                    removeEl(firstCommentNode.previousSibling);
                }
                removeEl(firstCommentNode);
            }
        }
    }
    // #[end]

    // native事件数组
    this.nativeEvents = [];

    if (this.source) {
        // 组件运行时传入的结构，做slot解析
        this._initSourceSlots(1);

        for (var i = 0, l = this.source.events.length; i < l; i++) {
            var eventBind = this.source.events[i];
            // 保存当前实例的native事件，下面创建aNode时候做合并
            if (eventBind.modifier.native) {
                this.nativeEvents.push(eventBind);
            }
            else {
                // #[begin] error
                warnEventListenMethod(eventBind, options.owner);
                // #[end]

                this.on(
                    eventBind.name,
                    getEventListener(eventBind, options.owner, this.scope, 1),
                    eventBind
                );
            }
        }

        this.tagName = this.tagName || this.source.tagName;
        this.binds = this.source._b;

        // init s-bind data
        this._srcSbindData = nodeSBindInit(this.source.directives.bind, this.scope, this.owner);
    }

    this._toPhase('compiled');


    // #[begin] devtool
    this._toPhase('beforeInit');
    // #[end]

    // init data
    var initData;
    try {
        initData = typeof this.initData === 'function' && this.initData();
    }
    catch (e) {
        handleError(e, this, 'initData');
    }
    initData = extend(initData || {}, options.data || this._srcSbindData);

    if (this.binds && this.scope) {
        for (var i = 0, l = this.binds.length; i < l; i++) {
            var bindInfo = this.binds[i];

            var value = evalExpr(bindInfo.expr, this.scope, this.owner);
            if (typeof value !== 'undefined') {
                // See: https://github.com/ecomfe/san/issues/191
                initData[bindInfo.name] = value;
            }
        }
    }

    this.data = new Data(initData);

    this.tagName = this.tagName || 'div';
    // #[begin] allua
    // ie8- 不支持innerHTML输出自定义标签
    /* istanbul ignore if */
    if (ieOldThan9 && this.tagName.indexOf('-') > 0) {
        this.tagName = 'div';
    }
    // #[end]


    // #[begin] error
    // 在初始化 + 数据绑定后，开始数据校验
    // NOTE: 只在开发版本中进行属性校验
    var dataTypes = this.dataTypes || clazz.dataTypes;
    if (dataTypes) {
        var dataTypeChecker = createDataTypesChecker(
            dataTypes,
            this.name || clazz.name
        );
        this.data.setTypeChecker(dataTypeChecker);
        this.data.checkDataTypes();
    }
    // #[end]

    this.computedDeps = {};
    for (var expr in this.computed) {
        if (this.computed.hasOwnProperty(expr) && !this.computedDeps[expr]) {
            this._calcComputed(expr);
        }
    }

    this._initDataChanger();
    this._sbindData = nodeSBindInit(this.aNode.directives.bind, this.data, this);
    this._toPhase('inited');

    // #[begin] reverse
    var reverseWalker = options.reverseWalker;
    if (this.el || reverseWalker) {
        var RootComponentType = this.components[this.aNode.tagName];

        // 入口根节点为多个组件
        if (!reverseWalker && this.aNode.directives['if']) {
            reverseWalker = new DOMChildrenWalker(this.el.parentNode);
        }

        if (reverseWalker && (this.aNode.hasRootNode || RootComponentType)) {
            this._rootNode = createReverseNode(this.aNode, this, this.data, this, reverseWalker);
            this._rootNode._getElAsRootNode && (this.el = this._rootNode._getElAsRootNode());
        }
        else if (this.el && RootComponentType) {
            this._rootNode = new RootComponentType({
                source: this.aNode,
                owner: this,
                scope: this.data,
                parent: this,
                el: this.el
            });
        }
        else {
            if (reverseWalker) {
                var currentNode = reverseWalker.current;
                if (currentNode && currentNode.nodeType === 1) {
                    this.el = currentNode;
                    reverseWalker.goNext();
                }
            }

            reverseElementChildren(this, this.data, this);
        }

        this._toPhase('created');
        this._attached();
        this._toPhase('attached');
    }
    // #[end]
}


/**
 * 初始化创建组件外部传入的插槽对象
 *
 * @protected
 * @param {boolean} isFirstTime 是否初次对sourceSlots进行计算
 */
Component.prototype._initSourceSlots = function (isFirstTime) {
    this.sourceSlots.named = {};

    // 组件运行时传入的结构，做slot解析
    if (this.source && this.scope) {
        var sourceChildren = this.source.children;

        for (var i = 0, l = sourceChildren.length; i < l; i++) {
            var child = sourceChildren[i];
            var target;

            var slotBind = !child.textExpr && getANodeProp(child, 'slot');
            if (slotBind) {
                isFirstTime && this.sourceSlotNameProps.push(slotBind);

                var slotName = evalExpr(slotBind.expr, this.scope, this.owner);
                target = this.sourceSlots.named[slotName];
                if (!target) {
                    target = this.sourceSlots.named[slotName] = [];
                }
                target.push(child);
            }
            else if (isFirstTime) {
                target = this.sourceSlots.noname;
                if (!target) {
                    target = this.sourceSlots.noname = [];
                }
                target.push(child);
            }
        }
    }
};

/**
 * 类型标识
 *
 * @type {string}
 */
Component.prototype.nodeType = NodeType.CMPT;

/**
 * 在下一个更新周期运行函数
 *
 * @param {Function} fn 要运行的函数
 */
Component.prototype.nextTick = nextTick;

Component.prototype._ctx = (new Date()).getTime().toString(16);

/* eslint-disable operator-linebreak */
/**
 * 使节点到达相应的生命周期
 *
 * @protected
 * @param {string} name 生命周期名称
 */
Component.prototype._toPhase = function (name) {
    if (!this.lifeCycle[name]) {
        this.lifeCycle = LifeCycle[name] || this.lifeCycle;
        if (typeof this[name] === 'function') {
            try {
                this[name]();
            }
            catch (e) {
                handleError(e, this, 'hook:' + name);
            }
        }

        this._afterLife = this.lifeCycle;

        // 通知devtool
        // #[begin] devtool
        emitDevtool('comp-' + name, this);
        // #[end]
    }
};
/* eslint-enable operator-linebreak */


/**
 * 添加事件监听器
 *
 * @param {string} name 事件名
 * @param {Function} listener 监听器
 * @param {string?} declaration 声明式
 */
Component.prototype.on = function (name, listener, declaration) {
    if (typeof listener === 'function') {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        this.listeners[name].push({fn: listener, declaration: declaration});
    }
};

/**
 * 移除事件监听器
 *
 * @param {string} name 事件名
 * @param {Function=} listener 监听器
 */
Component.prototype.un = function (name, listener) {
    var nameListeners = this.listeners[name];
    var len = nameListeners && nameListeners.length;

    while (len--) {
        if (!listener || listener === nameListeners[len].fn) {
            nameListeners.splice(len, 1);
        }
    }
};


/**
 * 派发事件
 *
 * @param {string} name 事件名
 * @param {Object} event 事件对象
 */
Component.prototype.fire = function (name, event) {
    var me = this;
    // #[begin] devtool
    emitDevtool('comp-event', {
        name: name,
        event: event,
        target: this
    });
    // #[end]

    each(this.listeners[name], function (listener) {
        try {
            listener.fn.call(me, event);
        }
        catch (e) {
            handleError(e, me, 'event:' + name);
        }
    });
};

/**
 * 计算 computed 属性的值
 *
 * @private
 * @param {string} computedExpr computed表达式串
 */
Component.prototype._calcComputed = function (computedExpr) {
    var computedDeps = this.computedDeps[computedExpr];
    if (!computedDeps) {
        computedDeps = this.computedDeps[computedExpr] = {};
    }

    var me = this;
    try {
        var result = this.computed[computedExpr].call({
            data: {
                get: function (expr) {
                    // #[begin] error
                    if (!expr) {
                        throw new Error('[SAN ERROR] call get method in computed need argument');
                    }
                    // #[end]

                    if (!computedDeps[expr]) {
                        computedDeps[expr] = 1;

                        if (me.computed[expr] && !me.computedDeps[expr]) {
                            me._calcComputed(expr);
                        }

                        me.watch(expr, function () {
                            me._calcComputed(computedExpr);
                        });
                    }

                    return me.data.get(expr);
                }
            }
        });
        this.data.set(computedExpr, result);
    }
    catch (e) {
        handleError(e, this, 'computed:' + computedExpr);
    }
};

/**
 * 派发消息
 * 组件可以派发消息，消息将沿着组件树向上传递，直到遇上第一个处理消息的组件
 *
 * @param {string} name 消息名称
 * @param {*?} value 消息值
 */
Component.prototype.dispatch = function (name, value) {
    var parentComponent = this.parentComponent;

    while (parentComponent) {
        var handler = parentComponent.messages[name] || parentComponent.messages['*'];
        if (typeof handler === 'function') {
            // #[begin] devtool
            emitDevtool('comp-message', {
                target: this,
                value: value,
                name: name,
                receiver: parentComponent
            });
            // #[end]

            try {
                handler.call(
                    parentComponent,
                    {target: this, value: value, name: name}
                );
            }
            catch (e) {
                handleError(e, parentComponent, 'message:' + (name || '*'));
            }
            return;
        }

        parentComponent = parentComponent.parentComponent;
    }

    // #[begin] devtool
    emitDevtool('comp-message', {target: this, value: value, name: name});
    // #[end]
};

/**
 * 获取组件内部的 slot
 *
 * @param {string=} name slot名称，空为default slot
 * @return {Array}
 */
Component.prototype.slot = function (name) {
    var result = [];
    var me = this;

    function childrenTraversal(children) {
        each(children, function (child) {
            if (child.nodeType === NodeType.SLOT && child.owner === me) {
                if (child.isNamed && child.name === name
                    || !child.isNamed && !name
                ) {
                    result.push(child);
                }
            }
            else {
                childrenTraversal(child.children);
            }
        });
    }

    childrenTraversal(this.children);
    return result;
};

/**
 * 获取带有 san-ref 指令的子组件引用
 *
 * @param {string} name 子组件的引用名
 * @return {Component}
 */
Component.prototype.ref = function (name) {
    var refTarget;
    var owner = this;

    function childrenTraversal(children) {
        if (children) {
            for (var i = 0, l = children.length; i < l; i++) {
                elementTraversal(children[i]);
                if (refTarget) {
                    return;
                }
            }
        }
    }

    function elementTraversal(element) {
        var nodeType = element.nodeType;
        if (nodeType === NodeType.TEXT) {
            return;
        }

        if (element.owner === owner) {
            var ref;
            switch (element.nodeType) {
                case NodeType.ELEM:
                    ref = element.aNode.directives.ref;
                    if (ref && evalExpr(ref.value, element.scope, owner) === name) {
                        refTarget = element.el;
                    }
                    break;

                case NodeType.CMPT:
                    ref = element.source.directives.ref;
                    if (ref && evalExpr(ref.value, element.scope, owner) === name) {
                        refTarget = element;
                    }
            }

            if (refTarget) {
                return;
            }

            childrenTraversal(element.slotChildren);
        }

        if (refTarget) {
            return;
        }

        childrenTraversal(element.children);
    }

    this._rootNode ? elementTraversal(this._rootNode) : childrenTraversal(this.children);

    return refTarget;
};


/**
 * 视图更新函数
 *
 * @param {Array?} changes 数据变化信息
 */
Component.prototype._update = function (changes) {
    if (this.lifeCycle.disposed) {
        return;
    }

    var me = this;


    var needReloadForSlot = false;
    this._notifyNeedReload = function () {
        needReloadForSlot = true;
    };

    if (changes) {
        if (this.source) {
            this._srcSbindData = nodeSBindUpdate(
                this.source.directives.bind,
                this._srcSbindData,
                this.scope,
                this.owner,
                changes,
                function (name, value) {
                    if (name in me.source._pi) {
                        return;
                    }

                    me.data.set(name, value, {
                        target: {
                            node: me.owner
                        }
                    });
                }
            );
        }

        each(changes, function (change) {
            var changeExpr = change.expr;

            each(me.binds, function (bindItem) {
                var relation;
                var setExpr = bindItem.name;
                var updateExpr = bindItem.expr;

                if (!isDataChangeByElement(change, me, setExpr)
                    && (relation = changeExprCompare(changeExpr, updateExpr, me.scope))
                ) {
                    if (relation > 2) {
                        setExpr = {
                            type: ExprType.ACCESSOR,
                            paths: [
                                {
                                    type: ExprType.STRING,
                                    value: setExpr
                                }
                            ].concat(changeExpr.paths.slice(updateExpr.paths.length))
                        };
                        updateExpr = changeExpr;
                    }

                    if (relation >= 2 && change.type === DataChangeType.SPLICE) {
                        me.data.splice(setExpr, [change.index, change.deleteCount].concat(change.insertions), {
                            target: {
                                node: me.owner
                            }
                        });
                    }
                    else {
                        me.data.set(setExpr, evalExpr(updateExpr, me.scope, me.owner), {
                            target: {
                                node: me.owner
                            }
                        });
                    }
                }
            });

            each(me.sourceSlotNameProps, function (bindItem) {
                needReloadForSlot = needReloadForSlot || changeExprCompare(changeExpr, bindItem.expr, me.scope);
                return !needReloadForSlot;
            });
        });

        if (needReloadForSlot) {
            this._initSourceSlots();
            this._repaintChildren();
        }
        else {
            var slotChildrenLen = this.slotChildren.length;
            while (slotChildrenLen--) {
                var slotChild = this.slotChildren[slotChildrenLen];

                if (slotChild.lifeCycle.disposed) {
                    this.slotChildren.splice(slotChildrenLen, 1);
                }
                else if (slotChild.isInserted) {
                    slotChild._update(changes, 1);
                }
            }
        }
    }

    var dataChanges = this._dataChanges;
    if (dataChanges) {
        // #[begin] devtool
        this._toPhase('beforeUpdate');
        // #[end]

        this._dataChanges = null;

        this._sbindData = nodeSBindUpdate(
            this.aNode.directives.bind,
            this._sbindData,
            this.data,
            this,
            dataChanges,
            function (name, value) {
                if (me._rootNode || (name in me.aNode._pi)) {
                    return;
                }

                getPropHandler(me.tagName, name)(me.el, value, name, me);
            }
        );

        var htmlDirective = this.aNode.directives.html;

        if (this._rootNode) {
            this._rootNode._update(dataChanges);
            this._rootNode._getElAsRootNode && (this.el = this._rootNode._getElAsRootNode());
        }
        else if (htmlDirective) {
            var len = dataChanges.length;
            while (len--) {
                if (changeExprCompare(dataChanges[len].expr, htmlDirective.value, this.data)) {
                    // #[begin] error
                    warnSetHTML(this.el);
                    // #[end]

                    this.el.innerHTML = evalExpr(htmlDirective.value, this.data, this);
                    break;
                }
            }
        }
        else {
            var dynamicProps = this.aNode._dp;
            for (var i = 0; i < dynamicProps.length; i++) {
                var prop = dynamicProps[i];

                for (var j = 0; j < dataChanges.length; j++) {
                    var change = dataChanges[j];
                    if (changeExprCompare(change.expr, prop.expr, this.data)
                        || prop.hintExpr && changeExprCompare(change.expr, prop.hintExpr, this.data)
                    ) {
                        prop.handler(this.el, evalExpr(prop.expr, this.data, this), prop.name, this);
                        break;
                    }
                }
            }

            for (var i = 0; i < this.children.length; i++) {
                this.children[i]._update(dataChanges);
            }
        }

        if (needReloadForSlot) {
            this._initSourceSlots();
            this._repaintChildren();
        }

        for (var i = 0; i < this.implicitChildren.length; i++) {
            this.implicitChildren[i]._update(dataChanges);
        }

        if (typeof this.updated === 'function') {
            this.updated();
        }

        if (this.owner && this._updateBindxOwner(dataChanges)) {
            this.owner._update();
        }
    }

    this._notifyNeedReload = null;
};

Component.prototype._updateBindxOwner = function (dataChanges) {
    var me = this;
    var xbindUped;

    each(dataChanges, function (change) {
        each(me.binds, function (bindItem) {
            var changeExpr = change.expr;
            if (bindItem.x
                && !isDataChangeByElement(change, me.owner)
                && changeExprCompare(changeExpr, parseExpr(bindItem.name), me.data)
            ) {
                var updateScopeExpr = bindItem.expr;
                if (changeExpr.paths.length > 1) {
                    updateScopeExpr = {
                        type: ExprType.ACCESSOR,
                        paths: bindItem.expr.paths.concat(changeExpr.paths.slice(1))
                    };
                }

                xbindUped = 1;
                me.scope.set(
                    updateScopeExpr,
                    evalExpr(changeExpr, me.data, me),
                    {
                        target: {
                            node: me,
                            prop: bindItem.name
                        }
                    }
                );
            }
        });
    });

    return xbindUped;
};

/**
 * 重新绘制组件的内容
 * 当 dynamic slot name 发生变更或 slot 匹配发生变化时，重新绘制
 * 在组件级别重绘有点粗暴，但是能保证视图结果正确性
 */
Component.prototype._repaintChildren = function () {
    // TODO: repaint once?

    if (this._rootNode) {
        var parentEl = this._rootNode.el.parentNode;
        var beforeEl = this._rootNode.el.nextSibling;
        this._rootNode.dispose(0, 1);
        this.slotChildren = [];

        this._rootNode = createNode(this.aNode, this, this.data, this);
        this._rootNode.attach(parentEl, beforeEl);
        this._rootNode._getElAsRootNode && (this.el = this._rootNode._getElAsRootNode());
    }
    else {
        elementDisposeChildren(this.children, 0, 1);
        this.children = [];
        this.slotChildren = [];

        for (var i = 0, l = this.aNode.children.length; i < l; i++) {
            var child = createNode(this.aNode.children[i], this, this.data, this);
            this.children.push(child);
            child.attach(this.el);
        }
    }
};


/**
 * 初始化组件内部监听数据变化
 *
 * @private
 * @param {Object} change 数据变化信息
 */
Component.prototype._initDataChanger = function (change) {
    var me = this;

    this._dataChanger = function (change) {
        if (me._afterLife.created) {
            if (!me._dataChanges) {
                nextTick(me._update, me);
                me._dataChanges = [];
            }

            me._dataChanges.push(change);
        }
        else if (me.lifeCycle.inited && me.owner) {
            me._updateBindxOwner([change]);
        }
    };

    this.data.listen(this._dataChanger);
};


/**
 * 监听组件的数据变化
 *
 * @param {string} dataName 变化的数据项
 * @param {Function} listener 监听函数
 */
Component.prototype.watch = function (dataName, listener) {
    var dataExpr = parseExpr(dataName);
    var value = evalExpr(dataExpr, this.data, this);
    var me = this;

    this.data.listen(function (change) {
        if (changeExprCompare(change.expr, dataExpr, me.data)) {
            var newValue = evalExpr(dataExpr, me.data, me);

            if (newValue !== value) {
                var oldValue = value;
                value = newValue;

                try {
                    listener.call(
                        me,
                        newValue,
                        {
                            oldValue: oldValue,
                            newValue: newValue,
                            change: change
                        }
                    );
                }
                catch (e) {
                    handleError(e, me, 'watch:' + dataName);
                }
            }
        }
    });
};

Component.prototype._getElAsRootNode = function () {
    return this.el;
};

/**
 * 将组件attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
Component.prototype.attach = function (parentEl, beforeEl) {
    if (!this.lifeCycle.attached) {
        // #[begin] devtool
        this._toPhase('beforeAttach');
        // #[end]

        var aNode = this.aNode;

        if (aNode.hasRootNode || this.components[aNode.tagName]) {
            // #[begin] devtool
            this._toPhase('beforeCreate');
            // #[end]
            this._rootNode = this._rootNode || createNode(aNode, this, this.data, this);
            this._rootNode.attach(parentEl, beforeEl);
            this._rootNode._getElAsRootNode && (this.el = this._rootNode._getElAsRootNode());
            this._toPhase('created');
        }
        else {
            if (!this.el) {
                // #[begin] devtool
                this._toPhase('beforeCreate');
                // #[end]

                var props;

                if (aNode._ce && aNode._i > 2) {
                    props = aNode._dp;
                    this.el = (aNode._el || preheatEl(aNode)).cloneNode(false);
                }
                else {
                    props = aNode.props;
                    this.el = createEl(this.tagName);
                }

                if (this._sbindData) {
                    for (var key in this._sbindData) {
                        if (this._sbindData.hasOwnProperty(key)) {
                            getPropHandler(this.tagName, key)(
                                this.el,
                                this._sbindData[key],
                                key,
                                this
                            );
                        }
                    }
                }

                for (var i = 0, l = props.length; i < l; i++) {
                    var prop = props[i];
                    var value = evalExpr(prop.expr, this.data, this);

                    if (value || !styleProps[prop.name]) {
                        prop.handler(this.el, value, prop.name, this);
                    }
                }

                this._toPhase('created');
            }

            insertBefore(this.el, parentEl, beforeEl);

            if (!this._contentReady) {
                var htmlDirective = aNode.directives.html;

                if (htmlDirective) {
                    // #[begin] error
                    warnSetHTML(this.el);
                    // #[end]

                    this.el.innerHTML = evalExpr(htmlDirective.value, this.data, this);
                }
                else {
                    for (var i = 0, l = aNode.children.length; i < l; i++) {
                        var childANode = aNode.children[i];
                        var child = childANode.Clazz
                            ? new childANode.Clazz(childANode, this, this.data, this)
                            : createNode(childANode, this, this.data, this);
                        this.children.push(child);
                        child.attach(this.el);
                    }
                }

                this._contentReady = 1;
            }

            this._attached();
        }

        this._toPhase('attached');

        // element 都是内部创建的，只有动态创建的 component 才会进入这个分支
        if (this.owner && !this.parent) {
            this.owner.implicitChildren.push(this);
        }
    }
};

Component.prototype.detach = elementOwnDetach;
Component.prototype.dispose = elementOwnDispose;
Component.prototype._onEl = elementOwnOnEl;
Component.prototype._attached = elementOwnAttached;
Component.prototype._leave = function () {
    if (this.leaveDispose) {
        if (!this.lifeCycle.disposed) {
            // #[begin] devtool
            this._toPhase('beforeDetach');
            // #[end]
            this.data.unlisten();
            this.dataChanger = null;
            this._dataChanges = null;

            var len = this.implicitChildren.length;
            while (len--) {
                this.implicitChildren[len].dispose(0, 1);
            }

            this.implicitChildren = null;

            this.source = null;
            this.sourceSlots = null;
            this.sourceSlotNameProps = null;

            // 这里不用挨个调用 dispose 了，因为 children 释放链会调用的
            this.slotChildren = null;


            if (this._rootNode) {
                // 如果没有parent，说明是一个root component，一定要从dom树中remove
                this._rootNode.dispose(this.disposeNoDetach && this.parent);
            }
            else {
                var len = this.children.length;
                while (len--) {
                    this.children[len].dispose(1, 1);
                }

                len = this._elFns.length;
                while (len--) {
                    var fn = this._elFns[len];
                    un(this.el, fn[0], fn[1], fn[2]);
                }
                this._elFns = null;

                // #[begin] allua
                /* istanbul ignore if */
                if (this._inputTimer) {
                    clearInterval(this._inputTimer);
                    this._inputTimer = null;
                }
                // #[end]

                // 如果没有parent，说明是一个root component，一定要从dom树中remove
                if (!this.disposeNoDetach || !this.parent) {
                    removeEl(this.el);
                }
            }

            this._toPhase('detached');

            // #[begin] devtool
            this._toPhase('beforeDispose');
            // #[end]

            this._rootNode = null;
            this.el = null;
            this.owner = null;
            this.scope = null;
            this.children = null;

            this._toPhase('disposed');

            if (this._ondisposed) {
                this._ondisposed();
            }
        }
    }
    else if (this.lifeCycle.attached) {
        // #[begin] devtool
        this._toPhase('beforeDetach');
        // #[end]

        if (this._rootNode) {
            if (this._rootNode.detach) {
                this._rootNode.detach();
            }
            else {
                this._rootNode.dispose();
                this._rootNode = null;
            }
        }
        else {
            removeEl(this.el);
        }

        this._toPhase('detached');
    }
};


exports = module.exports = Component;
