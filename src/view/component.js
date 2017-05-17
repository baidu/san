/**
 * @file 组件类
 * @author errorrik(errorrik@gmail.com)
 */

var inherits = require('../util/inherits');
var bind = require('../util/bind');
var each = require('../util/each');
var extend = require('../util/extend');
var nextTick = require('../util/next-tick');
var emitDevtool = require('../util/emit-devtool');
var Element = require('./element');
var IndexedList = require('../util/indexed-list');
var ExprType = require('../parser/expr-type');
var ANode = require('../parser/a-node');
var parseExpr = require('../parser/parse-expr');
var parseText = require('../parser/parse-text');
var parseTemplate = require('../parser/parse-template');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var evalExpr = require('../runtime/eval-expr');
var changeExprCompare = require('../runtime/change-expr-compare');
var defineComponent = require('./define-component');
var isComponent = require('./is-component');
var isDataChangeByElement = require('./is-data-change-by-element');
var eventDeclarationListener = require('./event-declaration-listener');
var serializeStump = require('./serialize-stump');
var fromElInitChilds = require('./from-el-init-childs');

/* eslint-disable guard-for-in */

/**
 * 组件类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function Component(options) {
    this.slotChilds = [];
    this.dataChanges = [];
    this.listeners = {};

    Element.call(this, options);
}

inherits(Component, Element);

/**
 * 类型标识
 *
 * @protected
 * @type {string}
 */
Component.prototype._type = 'component';

/* eslint-disable operator-linebreak */
/**
 * 使节点到达相应的生命周期
 *
 * @protected
 * @param {string} name 生命周期名称
 */
Component.prototype._callHook =
Component.prototype._toPhase = function (name) {
    Node.prototype._toPhase.call(this, name);

    if (typeof this[name] === 'function') {
        this[name].call(this);
    }

    // 通知devtool
    // #[begin] devtool
    emitDevtool('comp-' + name, this);
    // #[end]
};
/* eslint-enable operator-linebreak */

/**
 * 通知自己和childs完成attached状态
 *
 * @protected
 */
Component.prototype._toAttached = function () {
    this._getEl();
    Node.prototype._toAttached.call(this);
};


/**
 * 添加事件监听器
 *
 * @param {string} name 事件名
 * @param {Function} listener 监听器
 */
Component.prototype.on = function (name, listener) {
    if (typeof listener === 'function') {
        if (!this.listeners[name]) {
            this.listeners[name] = [];
        }
        this.listeners[name].push(listener);
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
        if (!listener || listener === nameListeners[len]) {
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
        listener.call(this, event);
    }, this);
};

/**
 * 初始化
 *
 * @param {Object} options 初始化参数
 */
Component.prototype.init = function (options) {
    this.filters = this.filters || this.constructor.filters || {};
    this.computed = this.computed || this.constructor.computed || {};
    this.messages = this.messages || this.constructor.messages || {};
    this.subTag = options.subTag;

    // compile
    this._compile();

    var me = this;
    var givenANode = options.aNode;
    if (!options.el) {
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

            this.aNode = new ANode({
                tagName: protoANode.tagName || givenANode.tagName,
                givenSlots: givenSlots,

                // 组件的实际结构应为template编译的结构
                childs: protoANode.childs,

                // 合并运行时的一些绑定和事件声明
                props: protoANode.props,
                binds: givenANode.props,
                events: protoANode.events,
                directives: givenANode.directives
            });
            each(givenANode.events, function (eventBind) {
                me.on(eventBind.name, bind(eventDeclarationListener, options.owner, eventBind, 1, options.scope));
            });
        }
    }

    this._toPhase('compiled');

    // init data
    this.data = new Data(
        extend(
            typeof this.initData === 'function' && this.initData() || {},
            options.data
        )
    );

    Element.prototype._init.call(this, options);

    this.binds.each(function (bind) {
        var expr = bind.expr;

        // 当 text 解析只有一项时，要么就是 string，要么就是 interp
        // interp 有可能是绑定到组件属性的表达式，不希望被 eval text 成 string
        // 所以这里做个处理，只有一项时直接抽出来
        if (expr.type === ExprType.TEXT && expr.segs.length === 1) {
            expr = bind.expr = expr.segs[0];
            if (expr.type === ExprType.INTERP && expr.filters.length === 0) {
                bind.expr = expr.expr;
            }
        }
    });

    this.scope && this.binds.each(function (bind) {
        me.data.set(bind.name, me.evalExpr(bind.expr));
    });

    this.computedDeps = {};
    for (var expr in this.computed) {
        if (!this.computedDeps[expr]) {
            this._calcComputed(expr);
        }
    }

    this._toPhase('inited');

    // #[begin] reverse
    // 如果从el编译的，认为已经attach了，触发钩子
    if (this._isInitFromEl) {
        this._toAttached();
    }
    // #[end]
};

// #[begin] reverse
/**
 * 从存在的 el 中编译抽象节点
 */
Component.prototype._initFromEl = function () {
    this._isInitFromEl = 1;
    this.aNode = parseANodeFromEl(this.el);
    this.aNode.givenSlots = {};
    this.aNode.binds = this.aNode.props;
    this.aNode.props = this.constructor.prototype.aNode.props;

    this.parent && this.parent._pushChildANode(this.aNode);
    this.tagName = this.aNode.tagName;

    fromElInitChilds(this);
};
// #[end]

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
                if (expr) {
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
                }

                // #[begin] error
                throw new Error('[SAN ERROR] call get method in computed need argument');
                // #[end]
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

    function childsTraversal(element) {
        each(element.childs, function (child) {
            if (isComponent(child)) {
                var refDirective = child.aNode.directives.get('ref');
                if (refDirective
                    && evalExpr(refDirective.value, child.scope || owner.data, owner) === name
                ) {
                    refComponent = child;
                }
            }
            else if (child instanceof Element) {
                childsTraversal(child);
            }

            return !refComponent;
        });
    }


    childsTraversal(this);
    each(this.slotChilds, function (slotChild) {
        childsTraversal(slotChild);
        return !refComponent;
    });
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
        proto.aNode = new ANode();

        var tpl = ComponentClass.template || proto.template;
        if (tpl) {
            var aNode = parseTemplate(tpl);
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
 * 初始化自身变化时，监听数据变化的行为
 *
 * @private
 */
Component.prototype._initSelfChanger = function () {
    if (!this.dataChanger) {
        this.dataChanger = bind(this._dataChanger, this);
        this.data.listen(this.dataChanger);
    }
};

/**
 * 视图更新函数
 *
 * @param {Array?} changes 数据变化信息
 */
Component.prototype.updateView = function (changes) {
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

                me.data.set(setExpr, me.evalExpr(updateExpr), {
                    target: {
                        id: me.owner.id
                    }
                });
            }
        });
    });


    var dataChanges = me.dataChanges;
    if (dataChanges.length) {
        me.dataChanges = [];
        me.props.each(function (prop) {
            each(dataChanges, function (change) {
                if (changeExprCompare(change.expr, prop.expr, me.data)) {
                    me.setProp(
                        prop.name,
                        evalExpr(prop.expr, me.data, me)
                    );

                    return false;
                }
            });
        });


        each(this.childs, function (child) {
            child.updateView(dataChanges);
        });

        each(this.slotChilds, function (child) {
            child.slotUpdateView(dataChanges);
        });

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

            me.owner.updateView();
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
    var len = this.dataChanges.length;

    if (!len) {
        nextTick(this.updateView, this);
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
 */
Component.prototype._dispose = function () {
    Element.prototype._dispose.call(this);

    // 这里不用挨个调用 dispose 了，因为 childs 释放链会调用的
    this.slotChilds = null;

    this.data.unlisten();
    this.dataChanger = null;
    this.dataChanges = null;

    this.data = null;
    this.listeners = null;
};


// #[begin] reverse
/**
 * 填充组件数据
 * create-node-by-el调用，用于组件反解时组件恢复数据
 *
 * @paran {Object} options 参数选项
 * @param {HTMLElement} options.el 数据承载的script标签元素
 * @param {Component} options.owner 所属组件
 */
Component._fillData = function (options) {
    var data = (new Function(
        'return ' + options.el.innerHTML.replace(/^[\s\n]*/ ,'')
    ))();

    for (var key in data) {
        options.owner.data.set(key, data[key]);
    }
};
// #[end]

// #[begin] ssr
/**
 * 序列化文本节点，用于服务端生成在浏览器端可被反解的html串
 *
 * @return {string}
 */
Component.prototype.serialize = function () {
    var element = this;
    var tagName = element.tagName;

    // start tag
    var str = '<' + tagName;
    element.props.each(function (prop) {
        var value = isComponent(element)
            ? evalExpr(prop.expr, element.data, element)
            : element.evalExpr(prop.expr, 1);

        str +=
            getPropHandler(element, prop.name)
                .input
                .attr(element, prop.name, value)
            || '';
    });

    element.binds.each(function (bindInfo) {
        str += ' prop-' + bindInfo.name + '="' + bindInfo.raw + '"';
    });

    if (element.subTag) {
        str += ' san-component="' + element.subTag + '"';
    }

    str += '>';

    // component data
    if (!element.owner) {
        str += serializeStump('data', JSON.stringify(element.data.get()));
    }

    // inner content
    each(element.aNode.childs, function (aNodeChild) {
        var child = createNode(aNodeChild, element);
        element.childs.push(child);
        str += child.serialize();
    });

    // close tag
    if (!autoCloseTags[tagName]) {
        str += '</' + tagName + '>';
    }

    return str;
};
// #[end]

exports = module.exports = Component;
