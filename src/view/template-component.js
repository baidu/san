/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 模板组件类
 */


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
var svgTags = require('../browser/svg-tags');
var insertBefore = require('../browser/insert-before');
var createNode = require('./create-node');
var preheatEl = require('./preheat-el');
var parseComponentTemplate = require('./parse-component-template');
var preheatANode = require('./preheat-a-node');
var LifeCycle = require('./life-cycle');
var getANodeProp = require('./get-a-node-prop');
var isDataChangeByElement = require('./is-data-change-by-element');
var hydrateElementChildren = require('./hydrate-element-children');
var NodeType = require('./node-type');
var styleProps = require('./style-props');
var nodeSBindInit = require('./node-s-bind-init');
var nodeSBindUpdate = require('./node-s-bind-update');
var elementOwnAttached = require('./element-own-attached');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var elementDisposeChildren = require('./element-dispose-children');
var handleError = require('../util/handle-error');
 
 
 
/**
 * 模板组件类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function TemplateComponent(options) { // eslint-disable-line
    options = options || {};
    this.lifeCycle = LifeCycle.start;
    this.id = guid++;

    this.children = [];
    this.slotChildren = [];
    this.implicitChildren = [];

    var clazz = this.constructor;

    this.owner = options.owner;
    this.scope = options.scope;
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

    var proto = clazz.prototype;

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

    if (this.source) {
        // 组件运行时传入的结构，做slot解析
        this._initSourceSlots(1);

        for (var i = 0, l = this.source.events.length; i < l; i++) {
            var eventBind = this.source.events[i];
            // 保存当前实例的native事件，下面创建aNode时候做合并
            if (eventBind.modifier.native) {
                // native事件数组
                this.nativeEvents = this.nativeEvents || [];
                this.nativeEvents.push(eventBind);
            }
        }

        this.tagName = this.tagName || this.source.tagName;
        this.binds = this.source._b;

        // init s-bind data
        this._srcSbindData = nodeSBindInit(this.source.directives.bind, this.scope, this.owner);
    }

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

    this._initDataChanger();
    this._sbindData = nodeSBindInit(this.aNode.directives.bind, this.data, this);
    this.lifeCycle = LifeCycle.inited;

    // #[begin] hydrate
    var hydrateWalker = options.hydrateWalker;
    if (hydrateWalker) {
        if (this.aNode.Clazz) {
            this._rootNode = createHydrateNode(this.aNode, this, this.data, this, hydrateWalker);
            this._rootNode._getElAsRootNode && (this.el = this._rootNode._getElAsRootNode());
        }
        else {
            this.el = hydrateWalker.current;
            hydrateWalker.goNext();

            hydrateElementChildren(this, this.data, this);
        }

        this.lifeCycle = LifeCycle.created;
        this._attached();
        this.lifeCycle = LifeCycle.attached;
    }
    // #[end]
}


/**
 * 初始化组件内部监听数据变化
 *
 * @private
 * @param {Object} change 数据变化信息
 */
TemplateComponent.prototype._initDataChanger = function () {
    var me = this;

    this._dataChanger = function (change) {
        if (me.lifeCycle.created) {
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
 * 将组件attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
TemplateComponent.prototype.attach = function (parentEl, beforeEl) {
    if (!this.lifeCycle.attached) {
        // #[begin] devtool
        emitDevtool('comp-beforeAttach', this);
        // #[end]

        var aNode = this.aNode;

        if (aNode.Clazz) {
            // #[begin] devtool
            emitDevtool('comp-beforeCreate', this);
            // #[end]

            this._rootNode = this._rootNode || createNode(aNode, this, this.data, this);
            this._rootNode.attach(parentEl, beforeEl);
            this._rootNode._getElAsRootNode && (this.el = this._rootNode._getElAsRootNode());
            
            this.lifeCycle = LifeCycle.created;
            // #[begin] devtool
            emitDevtool('comp-create', this);
            // #[end]
        }
        else {
            if (!this.el) {
                // #[begin] devtool
                emitDevtool('comp-beforeCreate', this);
                // #[end]

                var props;

                if (aNode._ce && aNode._i > 2) {
                    props = aNode._dp;
                    this.el = (aNode._el || preheatEl(aNode)).cloneNode(false);
                }
                else {
                    props = aNode.props;
                    this.el = svgTags[this.tagName] && document.createElementNS
                        ? document.createElementNS('http://www.w3.org/2000/svg', this.tagName)
                        : document.createElement(this.tagName);
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

                this.lifeCycle = LifeCycle.created;
                // #[begin] devtool
                emitDevtool('comp-create', this);
                // #[end]
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

        this.lifeCycle = LifeCycle.attached;
        // #[begin] devtool
        emitDevtool('comp-attached', this);
        // #[end]
    }
};

/**
 * 类型标识
 *
 * @type {string}
 */
TemplateComponent.prototype.nodeType = NodeType.CMPT;

TemplateComponent.prototype._getElAsRootNode = function () {
    return this.el;
};

/**
 * 视图更新函数
 *
 * @param {Array?} changes 数据变化信息
 */
TemplateComponent.prototype._update = function (changes) {
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
        emitDevtool('comp-beforeUpdate', this);
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

        if (this.owner && this._updateBindxOwner(dataChanges)) {
            this.owner._update();
        }
    }

    this._notifyNeedReload = null;
};

TemplateComponent.prototype._updateBindxOwner = function (dataChanges) {
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
 * 初始化创建组件外部传入的插槽对象
 *
 * @protected
 * @param {boolean} isFirstTime 是否初次对sourceSlots进行计算
 */
TemplateComponent.prototype._initSourceSlots = function (isFirstTime) {
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

TemplateComponent.prototype._repaintChildren = function () {
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

TemplateComponent.prototype._leave = function () {
    if (this.leaveDispose) {
        if (!this.lifeCycle.disposed) {
            // #[begin] devtool
            emitDevtool('comp-beforeDetach', this);
            // #[end]

            this.data.unlisten();
            this.dataChanger = null;
            this._dataChanges = null;

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

            this.lifeCycle = LifeCycle.detached;
            // #[begin] devtool
            emitDevtool('comp-detached', this);
            // #[end]

            // #[begin] devtool
            emitDevtool('comp-beforeDispose', this);
            // #[end]

            this._rootNode = null;
            this.el = null;
            this.owner = null;
            this.scope = null;
            this.children = null;

            this.lifeCycle = LifeCycle.disposed;
            // #[begin] devtool
            emitDevtool('comp-disposed', this);
            // #[end]

            if (this._ondisposed) {
                this._ondisposed();
            }
        }
    }
    else if (this.lifeCycle.attached) {
        // #[begin] devtool
        emitDevtool('comp-beforeDetach', this);
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

        this.lifeCycle = LifeCycle.detached;
        // #[begin] devtool
        emitDevtool('comp-detached', this);
        // #[end]
    }
};

TemplateComponent.prototype.detach = elementOwnDetach;
TemplateComponent.prototype.dispose = elementOwnDispose;
TemplateComponent.prototype._attached = elementOwnAttached;

exports = module.exports = TemplateComponent;
