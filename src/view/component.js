/**
 * @file 组件类
 * @author errorrik(errorrik@gmail.com)
 */

var bind = require('../util/bind');
var each = require('../util/each');
var extend = require('../util/extend');
var nextTick = require('../util/next-tick');
var emitDevtool = require('../util/emit-devtool');
var IndexedList = require('../util/indexed-list');
var ExprType = require('../parser/expr-type');
var createANode = require('../parser/create-a-node');
var parseExpr = require('../parser/parse-expr');
var parseText = require('../parser/parse-text');
var parseTemplate = require('../parser/parse-template');
var parseANodeFromEl = require('../parser/parse-anode-from-el');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var evalExpr = require('../runtime/eval-expr');
var changeExprCompare = require('../runtime/change-expr-compare');

var defineComponent = require('./define-component');
var attachings = require('./attachings');
var isComponent = require('./is-component');
var isDataChangeByElement = require('./is-data-change-by-element');
var eventDeclarationListener = require('./event-declaration-listener');
var fromElInitChilds = require('./from-el-init-childs');
var postComponentBinds = require('./post-component-binds');
var camelComponentBinds = require('./camel-component-binds');
var nodeEvalExpr = require('./node-eval-expr');
var NodeType = require('./node-type');
var nodeInit = require('./node-init');
var elementInitProps = require('./element-init-props');
var elementInitTagName = require('./element-init-tag-name');
var elementAttached = require('./element-attached');
var elementDispose = require('./element-dispose');
var elementUpdateChilds = require('./element-update-childs');
var elementSetElProp = require('./element-set-el-prop');
var elementOwnGetEl = require('./element-own-get-el');
var elementOwnOnEl = require('./element-own-on-el');
var elementOwnCreate = require('./element-own-create');
var elementOwnAttach = require('./element-own-attach');
var elementOwnDetach = require('./element-own-detach');
var elementOwnAttachHTML = require('./element-own-attach-html');
var elementOwnPushChildANode = require('./element-own-push-child-anode');

var createDataTypesChecker = require('../util/create-data-types-checker');

/* eslint-disable guard-for-in */

/**
 * 组件类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function Component(options) {
    elementInitProps(this);
    options = options || {};

    this.dataChanges = [];
    this.listeners = {};
    this.ownSlotChilds = [];


    this.filters = this.filters || this.constructor.filters || {};
    this.computed = this.computed || this.constructor.computed || {};
    this.messages = this.messages || this.constructor.messages || {};
    this.subTag = options.subTag;

    // compile
    this._compile();

    var me = this;

    var givenANode = options.aNode;
    var protoANode = this.constructor.prototype.aNode;

    if (givenANode) {
        // 组件运行时传入的结构，做slot解析
        var givenSlots = {};
        each(givenANode.childs, function (child) {
            var slotName = '____';
            var slotBind = !child.isText && child.props.get('slot');
            if (slotBind) {
                slotName = slotBind.raw;
            }

            if (!givenSlots[slotName]) {
                givenSlots[slotName] = [];
            }

            givenSlots[slotName].push(child);
        });

        this.aNode = createANode({
            tagName: protoANode.tagName || givenANode.tagName,
            givenSlots: givenSlots,

            // 组件的实际结构应为template编译的结构
            childs: protoANode.childs,

            // 合并运行时的一些绑定和事件声明
            props: protoANode.props,
            binds: camelComponentBinds(givenANode.props),
            events: protoANode.events,
            directives: givenANode.directives
        });
        each(givenANode.events, function (eventBind) {
            me.on(
                eventBind.name,
                bind(eventDeclarationListener, options.owner, eventBind, 1, options.scope),
                eventBind
            );
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

    nodeInit(options, this);

    // #[begin] reverse
    if (this.el) {
        this.aNode = parseANodeFromEl(this.el);
        this.aNode.givenSlots = {};
        this.aNode.binds = camelComponentBinds(this.aNode.props);
        this.aNode.props = this.constructor.prototype.aNode.props;

        this.parent && this.parent._pushChildANode(this.aNode);
        this.tagName = this.aNode.tagName;

        fromElInitChilds(this);
        attachings.add(this);
    }
    // #[end]

    elementInitTagName(this);
    this.props = this.aNode.props;
    this.binds = this.aNode.binds || this.aNode.props;

    postComponentBinds(this.binds);
    this.scope && this.binds.each(function (bind) {
        me.data.set(bind.name, nodeEvalExpr(me, bind.expr));
    });

    // #[begin] error
    // 在初始化 + 数据绑定后，开始数据校验
    // NOTE: 只在开发版本中进行属性校验
    var dataTypes = this.dataTypes || this.constructor.dataTypes;
    if (dataTypes) {
        var dataTypeChecker = createDataTypesChecker(
            dataTypes,
            this.subTag || this.name || this.constructor.name
        );
        this.data.setTypeChecker(dataTypeChecker);
        this.data.checkDataTypes();
    }
    // #[end]

    this.computedDeps = {};
    for (var expr in this.computed) {
        if (!this.computedDeps[expr]) {
            this._calcComputed(expr);
        }
    }

    if (!this.dataChanger) {
        this.dataChanger = bind(this._dataChanger, this);
        this.data.listen(this.dataChanger);
    }
    this._toPhase('inited');

    // #[begin] reverse
    // 如果从el编译的，认为已经attach了，触发钩子
    if (this.el) {
        attachings.done();
    }
    // #[end]
}

/**
 * 类型标识
 *
 * @protected
 * @type {string}
 */
Component.prototype._type = NodeType.CMPT;

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
    if (this.lifeCycle.is(name)) {
        return;
    }

    this.lifeCycle.set(name);

    if (typeof this[name] === 'function') {
        this[name](this);
    }

    // 通知devtool
    // #[begin] devtool
    emitDevtool('comp-' + name, this);
    // #[end]
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
        listener.fn.call(this, event);
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
        if (typeof parentComponent.messages[name] === 'function') {
            parentComponent.messages[name].call(
                parentComponent,
                {target: this, value: value}
            );
            break;
        }

        parentComponent = parentComponent.parentComponent;
    }
};

/**
 * 获取带有 san-ref 指令的子组件引用
 *
 * @param {string} name 子组件的引用名
 * @return {Component}
 */
Component.prototype.ref = function (name) {
    var refComponent;
    var owner = this;

    function slotChildsTraversal(childs) {
        each(childs, function (slotChild) {
            childsTraversal(slotChild);
            return !refComponent;
        });
    }

    function childsTraversal(element) {
        slotChildsTraversal(element.slotChilds);

        each(element.childs, function (child) {
            if (isComponent(child)) {
                var refDirective = child.aNode.directives.get('ref');
                if (refDirective
                    && evalExpr(refDirective.value, child.scope || owner.data, owner) === name
                ) {
                    refComponent = child;
                }

                slotChildsTraversal(child.slotChilds);
            }

            if (!refComponent && child._type !== NodeType.TEXT) {
                childsTraversal(child);
            }

            return !refComponent;
        });
    }

    childsTraversal(this);
    slotChildsTraversal(this.ownSlotChilds);

    return refComponent;
};

/* eslint-disable quotes */
var componentPropExtra = [
    {name: 'class', expr: parseText("{{class | _class | _sep(' ')}}")},
    {name: 'style', expr: parseText("{{style | _style | _sep(';')}}")}
];
/* eslint-enable quotes */


/**
 * 模板编译行为
 *
 * @private
 */
Component.prototype._compile = function () {
    var ComponentClass = this.constructor;
    var proto = ComponentClass.prototype;

    // pre define components class
    if (!proto.hasOwnProperty('_cmptReady')) {
        proto.components =  ComponentClass.components || proto.components || {};
        var components = proto.components;

        for (var key in components) {
            var componentClass = components[key];

            if (typeof componentClass === 'object') {
                components[key] = defineComponent(componentClass);
            }
            else if (componentClass === 'self') {
                components[key] = ComponentClass;
            }
        }

        proto._cmptReady = 1;
    }


    // pre compile template
    if (!proto.hasOwnProperty('_compiled')) {
        proto.aNode = createANode();

        var tpl = ComponentClass.template || proto.template;
        if (tpl) {
            var aNode = parseTemplate(tpl, {
                trimWhitespace: proto.trimWhitespace || ComponentClass.trimWhitespace
            });
            var firstChild = aNode.childs[0];

            // #[begin] error
            if (aNode.childs.length !== 1 || firstChild.isText) {
                throw new Error('[SAN FATAL] template must have a root element.');
            }
            // #[end]

            proto.aNode = firstChild;
            if (firstChild.tagName === 'template') {
                firstChild.tagName = null;
            }

            firstChild.binds = new IndexedList();

            each(componentPropExtra, function (extra) {
                var prop = firstChild.props.get(extra.name);
                if (prop) {
                    prop.expr.segs.push(extra.expr.segs[0]);
                    prop.expr.value = null;
                    prop.attr = null;
                }
                else {
                    firstChild.props.push({
                        name: extra.name,
                        expr: extra.expr
                    });
                }
            });
        }

        proto._compiled = 1;
    }
};

/**
 * 视图更新函数
 *
 * @param {Array?} changes 数据变化信息
 */
Component.prototype._update = function (changes) {
    if (this.lifeCycle.is('disposed')) {
        return;
    }

    var me = this;

    each(changes, function (change) {
        var changeExpr = change.expr;

        me.binds.each(function (bindItem) {
            var relation;
            var setExpr = bindItem.name;
            var updateExpr = bindItem.expr;

            if (!isDataChangeByElement(change, me, setExpr)
                && (relation = changeExprCompare(changeExpr, updateExpr, me.scope))
            ) {
                if (relation > 2) {
                    setExpr = {
                        type: ExprType.ACCESSOR,
                        paths: [{
                            type: ExprType.STRING,
                            value: setExpr
                        }].concat(changeExpr.paths.slice(updateExpr.paths.length))
                    };
                    updateExpr = changeExpr;
                }

                me.data.set(setExpr, nodeEvalExpr(me, updateExpr), {
                    target: {
                        id: me.owner.id
                    }
                });
            }
        });
    });

    each(this.slotChilds, function (child) {
        elementUpdateChilds(child, changes);
    });


    var dataChanges = me.dataChanges;
    if (dataChanges.length) {
        me.dataChanges = [];
        me.props.each(function (prop) {
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

        elementUpdateChilds(this, dataChanges, 'ownSlotChilds');

        this._toPhase('updated');

        if (me.owner) {
            each(dataChanges, function (change) {
                me.binds.each(function (bindItem) {
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

            me.owner._update();
        }

    }
};


/**
 * 组件内部监听数据变化的函数
 *
 * @private
 * @param {Object} change 数据变化信息
 */
Component.prototype._dataChanger = function (change) {
    if (this.lifeCycle.is('painting') || this.lifeCycle.is('created')) {
        var len = this.dataChanges.length;

        if (!len) {
            nextTick(this._update, this);
        }

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
 * @param {boolean} dontDetach 是否不要将节点从DOM移除
 */
Component.prototype.dispose = function (dontDetach) {
    if (!this.lifeCycle.is('disposed')) {
        elementDispose(this, dontDetach);

        this.ownSlotChilds = null;

        this.data.unlisten();
        this.dataChanger = null;
        this.dataChanges = null;

        this.listeners = null;

        this._toPhase('disposed');
    }
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

// #[begin] reverse
Component.prototype._pushChildANode = elementOwnPushChildANode;
// #[end]

exports = module.exports = Component;
