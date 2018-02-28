/**
 * @file 组件类
 * @author errorrik(errorrik@gmail.com)
 */

var bind = require('../util/bind');
var each = require('../util/each');
var extend = require('../util/extend');
var nextTick = require('../util/next-tick');
var emitDevtool = require('../util/emit-devtool');
var getPropAndIndex = require('../util/get-prop-and-index');
var ExprType = require('../parser/expr-type');
var createANode = require('../parser/create-a-node');
var parseExpr = require('../parser/parse-expr');
var createAccessor = require('../parser/create-accessor');
var removeEl = require('../browser/remove-el');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var evalExpr = require('../runtime/eval-expr');
var changeExprCompare = require('../runtime/change-expr-compare');
var analyseExprDataRef = require('../runtime/analyse-expr-data-ref');
var compileComponent = require('./compile-component');
var attachings = require('./attachings');
var isDataChangeByElement = require('./is-data-change-by-element');
var eventDeclarationListener = require('./event-declaration-listener');
var reverseElementChildren = require('./reverse-element-children');
var postComponentBinds = require('./post-component-binds');
var camelComponentBinds = require('./camel-component-binds');
var nodeEvalExpr = require('./node-eval-expr');
var NodeType = require('./node-type');
var nodeInit = require('./node-init');
var elementInitProps = require('./element-init-props');
var elementInitTagName = require('./element-init-tag-name');
var elementAttached = require('./element-attached');
var elementDispose = require('./element-dispose');
var elementUpdateChildren = require('./element-update-children');
var elementSetElProp = require('./element-set-el-prop');
var elementOwnGetEl = require('./element-own-get-el');
var elementOwnOnEl = require('./element-own-on-el');
var elementOwnCreate = require('./element-own-create');
var elementOwnAttach = require('./element-own-attach');
var elementOwnDetach = require('./element-own-detach');
var elementOwnAttachHTML = require('./element-own-attach-html');
var warnEventListenMethod = require('./warn-event-listen-method');
var elementLeave = require('./element-leave');
var elementToPhase = require('./element-to-phase');
var elementDisposeChildren = require('./element-dispose-children');
var elementAttach = require('./element-attach');
var createDataTypesChecker = require('../util/create-data-types-checker');



/**
 * 组件类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function Component(options) { // eslint-disable-line
    elementInitProps(this);
    options = options || {};

    this.listeners = {};
    this.slotChildren = [];

    var clazz = this.constructor;

    this.filters = this.filters || clazz.filters || {};
    this.computed = this.computed || clazz.computed || {};
    this.messages = this.messages || clazz.messages || {};
    this.subTag = options.subTag;

    // compile
    compileComponent(clazz);
    componentPreheat(this);

    var me = this;
    var protoANode = clazz.prototype.aNode;

    me.givenANode = options.aNode;
    me.givenNamedSlotBinds = [];
    me.givenSlots = {
        named: {}
    };

    nodeInit(options, this);

    // #[begin] reverse
    if (this.el) {
        var firstChild = this.el.firstChild;
        if (firstChild && firstChild.nodeType === 8) {
            var stumpMatch = firstChild.data.match(/^\s*s-data:([\s\S]+)?$/);
            if (stumpMatch) {
                var stumpText = stumpMatch[1];

                // fill component data
                options.data = (new Function(
                    'return ' + stumpText.replace(/^[\s\n]*/, '')
                ))();

                removeEl(firstChild);
            }
        }
    }
    // #[end]

    if (me.givenANode) {
        // 组件运行时传入的结构，做slot解析
        this._createGivenSlots();

        // native事件数组
        var nativeEvents = [];
        each(me.givenANode.events, function (eventBind) {
            // 保存当前实例的native事件，下面创建aNode时候做合并
            if (eventBind.modifier.native) {
                nativeEvents.push(eventBind);
            }
            // #[begin] error
            warnEventListenMethod(eventBind, options.owner);
            // #[end]

            me.on(
                eventBind.name,
                bind(eventDeclarationListener, options.owner, eventBind, 1, options.scope),
                eventBind
            );
        });

        this.aNode = createANode({
            tagName: protoANode.tagName || me.givenANode.tagName,
            givenSlots: me.givenSlots,

            // 组件的实际结构应为template编译的结构
            children: protoANode.children,

            // 合并运行时的一些绑定和事件声明
            props: protoANode.props,
            binds: camelComponentBinds(me.givenANode.props),
            events: protoANode.events.concat(nativeEvents),
            directives: me.givenANode.directives
        });
    }

    this._toPhase('compiled');

    // init data
    this.data = new Data(
        extend(
            typeof this.initData === 'function' && this.initData() || {},
            options.data
        )
    );

    elementInitTagName(this);
    this.props = this.aNode.props;
    this.binds = this.aNode.binds || this.aNode.props;

    postComponentBinds(this.binds);
    this.scope && each(this.binds, function (bind) {
        var value = nodeEvalExpr(me, bind.expr);
        if (typeof value === 'undefined') {
            // See: https://github.com/ecomfe/san/issues/191
            return;
        }
        me.data.set(bind.name, value);
    });

    // #[begin] error
    // 在初始化 + 数据绑定后，开始数据校验
    // NOTE: 只在开发版本中进行属性校验
    var dataTypes = this.dataTypes || clazz.dataTypes;
    if (dataTypes) {
        var dataTypeChecker = createDataTypesChecker(
            dataTypes,
            this.subTag || this.name || clazz.name
        );
        this.data.setTypeChecker(dataTypeChecker);
        this.data.checkDataTypes();
    }
    // #[end]

    this.computedDeps = {};
    /* eslint-disable guard-for-in */
    for (var expr in this.computed) {
        if (!this.computedDeps[expr]) {
            this._calcComputed(expr);
        }
    }
    /* eslint-enable guard-for-in */

    if (!this.dataChanger) {
        this.dataChanger = bind(this._dataChanger, this);
        this.data.listen(this.dataChanger);
    }
    this._toPhase('inited');

    // #[begin] reverse
    if (this.el) {
        attachings.add(this);
        reverseElementChildren(this);
        attachings.done();
    }

    var walker = options.reverseWalker;
    if (walker) {
        var currentNode = walker.current;
        if (currentNode && currentNode.nodeType === 1) {
            this.el = currentNode;
            this.el.id = this.id;
            walker.goNext();
        }

        reverseElementChildren(this);

        attachings.add(me);
    }
    // #[end]
}

/**
 * 组件预热，分析组件aNode的数据引用
 *
 * @param {Object} component 组件实例
 */
function componentPreheat(component) {
    var stack = [];

    function analyseANodeDataRef(aNode) {
        if (!aNode.dataRef) {
            stack.push(aNode);
            aNode.dataRef = {};

            if (aNode.isText) {
                recordDataRef(analyseExprDataRef(aNode.textExpr));
            }
            else {
                each(aNode.vars, function (varItem) {
                    recordDataRef(analyseExprDataRef(varItem.expr));
                });

                each(aNode.props, function (prop) {
                    recordDataRef(analyseExprDataRef(prop.expr));
                });

                /* eslint-disable guard-for-in */
                for (var key in aNode.directives) {
                    var directive = aNode.directives[key];
                    recordDataRef(analyseExprDataRef(directive.value));
                }
                /* eslint-enable guard-for-in */

                each(aNode.elses, function (child) {
                    analyseANodeDataRef(child);
                });

                each(aNode.children, function (child) {
                    analyseANodeDataRef(child);
                });
            }

            stack.pop();
        }
    }

    function recordDataRef(dataRefs) {
        each(stack, function (aNode) {
            each(dataRefs, function (dataRef) {
                aNode.dataRef[dataRef] = 1;
            });
        });
    }

    analyseANodeDataRef(component.constructor.prototype.aNode);
}

/**
 * 初始化创建组件外部传入的插槽对象
 *
 * @protected
 */
Component.prototype._createGivenSlots = function () {
    var me = this;
    me.givenSlots.named = {};

    // 组件运行时传入的结构，做slot解析
    me.givenANode && me.scope && each(me.givenANode.children, function (child) {
        var target;

        var slotBind = !child.isText && getPropAndIndex(child, 'slot');
        if (slotBind) {
            !me.givenSlotInited && me.givenNamedSlotBinds.push(slotBind);

            var slotName = nodeEvalExpr(me, slotBind.expr);
            target = me.givenSlots.named[slotName];
            if (!target) {
                target = me.givenSlots.named[slotName] = [];
            }
        }
        else if (!me.givenSlotInited) {
            target = me.givenSlots.noname;
            if (!target) {
                target = me.givenSlots.noname = [];
            }
        }

        target && target.push(child);
    });

    me.givenSlotInited = true;
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

/* eslint-disable operator-linebreak */
/**
 * 使节点到达相应的生命周期
 *
 * @protected
 * @param {string} name 生命周期名称
 */
Component.prototype._callHook =
Component.prototype._toPhase = function (name) {
    if (elementToPhase(this, name)) {
        if (typeof this[name] === 'function') {
            this[name]();
        }

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
    each(this.listeners[name], function (listener) {
        !listener.declaration.modifier.native && listener.fn.call(this, event);
    }, this);
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

    this.data.set(computedExpr, this.computed[computedExpr].call({
        data: {
            get: bind(function (expr) {
                // #[begin] error
                if (!expr) {
                    throw new Error('[SAN ERROR] call get method in computed need argument');
                }
                // #[end]

                if (!computedDeps[expr]) {
                    computedDeps[expr] = 1;

                    if (this.computed[expr]) {
                        this._calcComputed(expr);
                    }

                    this.watch(expr, function () {
                        this._calcComputed(computedExpr);
                    });
                }

                return this.data.get(expr);
            }, this)
        }
    }));
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
        var receiver = parentComponent.messages[name] || parentComponent.messages['*'];
        if (typeof receiver === 'function') {
            receiver.call(
                parentComponent,
                {target: this, value: value, name: name}
            );
            break;
        }

        parentComponent = parentComponent.parentComponent;
    }
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
        each(children, function (child) {
            elementTraversal(child);
            return !refTarget;
        });
    }

    function elementTraversal(element) {
        if (element.owner === owner) {
            switch (element.nodeType) {
                case NodeType.ELEM:
                case NodeType.CMPT:
                    var ref = element.aNode.directives.ref;
                    if (ref && evalExpr(ref.value, element.scope, owner) === name) {
                        refTarget = NodeType.ELEM === element.nodeType
                            ? element._getEl() : element;
                    }
            }

            !refTarget && childrenTraversal(element.slotChildren);
        }

        !refTarget && each(element.children, function (child) {
            if (child.nodeType !== NodeType.TEXT) {
                elementTraversal(child);
            }

            return !refTarget;
        });
    }

    childrenTraversal(this.children);

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
                        setExpr = createAccessor(
                            [
                                {
                                    type: ExprType.STRING,
                                    value: setExpr
                                }
                            ].concat(changeExpr.paths.slice(updateExpr.paths.length))
                        );

                        updateExpr = changeExpr;
                    }

                    me.data.set(setExpr, nodeEvalExpr(me, updateExpr), {
                        target: {
                            id: me.owner.id
                        }
                    });
                }
            });

            each(me.givenNamedSlotBinds, function (bindItem) {
                needReloadForSlot = needReloadForSlot || changeExprCompare(changeExpr, bindItem.expr, me.scope);
                return !needReloadForSlot;
            });
        });

        if (needReloadForSlot) {
            this._createGivenSlots();
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

    var dataChanges = this.dataChanges;
    if (dataChanges) {
        this.dataChanges = null;
        each(this.props, function (prop) {
            each(dataChanges, function (change) {
                if (changeExprCompare(change.expr, prop.expr, me.data)
                    || prop.hintExpr && changeExprCompare(change.expr, prop.hintExpr, me.data)
                ) {
                    elementSetElProp(
                        me,
                        prop.name,
                        evalExpr(prop.expr, me.data, me)
                    );

                    return false;
                }
            });
        });

        elementUpdateChildren(this, dataChanges);
        if (needReloadForSlot) {
            this._createGivenSlots();
            this._repaintChildren();
        }

        this._toPhase('updated');

        if (this.owner) {
            this._updateBindxOwner(dataChanges);
            this.owner._update();
        }
    }

    this._notifyNeedReload = null;
};

Component.prototype._updateBindxOwner = function (dataChanges) {
    var me = this;

    if (this.owner) {
        each(dataChanges, function (change) {
            each(me.binds, function (bindItem) {
                var changeExpr = change.expr;
                if (bindItem.x
                    && !isDataChangeByElement(change, me.owner)
                    && changeExprCompare(changeExpr, parseExpr(bindItem.name), me.data)
                ) {
                    var updateScopeExpr = bindItem.expr;
                    if (changeExpr.paths.length > 1) {
                        updateScopeExpr = createAccessor(
                            bindItem.expr.paths.concat(changeExpr.paths.slice(1))
                        );
                    }

                    me.scope.set(
                        updateScopeExpr,
                        evalExpr(changeExpr, me.data, me),
                        {
                            target: {
                                id: me.id,
                                prop: bindItem.name
                            }
                        }
                    );
                }
            });
        });
    }
};

/**
 * 重新绘制组件的内容
 * 当 dynamic slot name 发生变更或 slot 匹配发生变化时，重新绘制
 * 在组件级别重绘有点粗暴，但是能保证视图结果正确性
 */
Component.prototype._repaintChildren = function () {
    elementDisposeChildren(this, {dontDetach: true, noTransition: true});

    this._contentReady = 0;
    this.slotChildren = [];
    elementAttach(this);
    attachings.done();
};


/**
 * 组件内部监听数据变化的函数
 *
 * @private
 * @param {Object} change 数据变化信息
 */
Component.prototype._dataChanger = function (change) {
    if (this.lifeCycle.painting || this.lifeCycle.created) {
        if (!this.dataChanges) {
            nextTick(this._update, this);
            this.dataChanges = [];
        }

        var len = this.dataChanges.length;
        while (len--) {
            switch (changeExprCompare(change.expr, this.dataChanges[len].expr)) {
                case 1:
                case 2:
                    if (change.type === DataChangeType.SET) {
                        this.dataChanges.splice(len, 1);
                    }
            }
        }

        this.dataChanges.push(change);
    }
    else if (this.lifeCycle.inited && this.owner) {
        this._updateBindxOwner([change]);
    }
};


/**
 * 监听组件的数据变化
 *
 * @param {string} dataName 变化的数据项
 * @param {Function} listener 监听函数
 */
Component.prototype.watch = function (dataName, listener) {
    var dataExpr = parseExpr(dataName);

    this.data.listen(bind(function (change) {
        if (changeExprCompare(change.expr, dataExpr, this.data)) {
            listener.call(this, evalExpr(dataExpr, this.data, this), change);
        }
    }, this));
};

/**
 * 组件销毁的行为
 *
 * @param {Object} options 销毁行为的参数
 */
Component.prototype.dispose = function (options) {
    var me = this;
    me._doneLeave = function () {
        if (!me.lifeCycle.disposed) {
            // 这里不用挨个调用 dispose 了，因为 children 释放链会调用的
            me.slotChildren = null;

            me.data.unlisten();
            me.dataChanger = null;
            me.dataChanges = null;

            elementDispose(me, options);
            me.listeners = null;

            me.givenANode = null;
            me.givenSlots = null;
            me.givenNamedSlotBinds = null;
        }
    };

    elementLeave(this, options);
};



/**
 * 完成组件 attached 后的行为
 *
 * @param {Object} element 元素节点
 */
Component.prototype._attached = function () {
    this._getEl();
    elementAttached(this);
};

Component.prototype.attach = elementOwnAttach;
Component.prototype.detach = elementOwnDetach;
Component.prototype._attachHTML = elementOwnAttachHTML;
Component.prototype._create = elementOwnCreate;
Component.prototype._getEl = elementOwnGetEl;
Component.prototype._onEl = elementOwnOnEl;


exports = module.exports = Component;
