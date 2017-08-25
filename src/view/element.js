/**
 * @file 元素类
 * @author errorrik(errorrik@gmail.com)
 */

var inherits = require('../util/inherits');
var bind = require('../util/bind');
var each = require('../util/each');
var StringBuffer = require('../util/string-buffer');
var Node = require('./node');
var getPropHandler = require('./get-prop-handler');
var genElementStartHTML = require('./gen-element-start-html');
var genElementEndHTML = require('./gen-element-end-html');
var genElementChildsHTML = require('./gen-element-childs-html');
var eventDeclarationListener = require('./event-declaration-listener');
var isDataChangeByElement = require('./is-data-change-by-element');
var fromElInitChilds = require('./from-el-init-childs');
var isComponent = require('./is-component');
var isBrowser = require('../browser/is-browser');
var on = require('../browser/on');
var un = require('../browser/un');
var removeEl = require('../browser/remove-el');
var createEl = require('../browser/create-el');
var ieOldThan9 = require('../browser/ie-old-than-9');
var evalExpr = require('../runtime/eval-expr');
var changeExprCompare = require('../runtime/change-expr-compare');
var parseANodeFromEl = require('../parser/parse-anode-from-el');

/* eslint-disable guard-for-in */

/**
 * 元素类
 *
 * @class
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component} options.owner 所属的组件对象
 */
function Element(options) {
    this.childs = [];
    this.slotChilds = [];
    this._elFns = {};

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

    // #[begin] reverse
    if (this.el) {
        this._initFromEl(options);
        this.el.id = this.id;
    }
    // #[end]

    this.tagName = this.tagName || this.aNode.tagName || 'div';
    // ie8- 不支持innerHTML输出自定义标签
    if (ieOldThan9 && this.tagName.indexOf('-') > 0) {
        this.tagName = 'div';
    }

    // ie 下，如果 option 没有 value 属性，select.value = xx 操作不会选中 option
    // 所以没有设置 value 时，默认把 option 的内容作为 value
    if (this.tagName === 'option'
        && !this.aNode.props.get('value')
        && this.aNode.childs[0]
    ) {
        this.aNode.props.push({
            name: 'value',
            expr: this.aNode.childs[0].textExpr
        });
    }

    this.props = this.aNode.props;
    this.binds = this.aNode.binds || this.aNode.props;
};

// #[begin] reverse
/**
 * 从已有的el进行初始化
 */
Element.prototype._initFromEl = function () {
    this.aNode = parseANodeFromEl(this.el);
    this.parent && this.parent._pushChildANode(this.aNode);
    this.tagName = this.aNode.tagName;

    if (!this.aNode.directives.get('html')) {
        fromElInitChilds(this);
    }
};
// #[end]


/**
 * 创建元素DOM行为
 */
Element.prototype._create = function () {
    var me = this;

    if (!this.el) {
        me.el = createEl(me.tagName);
        me.el.id = me.id;

        me.props.each(function (prop) {
            var value = isComponent(me)
                ? evalExpr(prop.expr, me.data, me)
                : me.evalExpr(prop.expr, 1);

            var match = /^\s+([a-z0-9_-]+)=(['"])([^\2]*)\2$/.exec(
                getPropHandler(me, prop.name)
                    .input
                    .attr(me, prop.name, value)
            );

            if (match) {
                me.el.setAttribute(match[1], match[3]);
            }
        });
    }
};

/**
 * 创建元素DOM
 */
Element.prototype.create = function () {
    if (!this.lifeCycle.is('created')) {
        this._create();
        this._toPhase('created');
    }
};

/**
 * 完成创建元素DOM后的行为
 */
Element.prototype._attached = function () {
    this._initRootBindx();

    var me = this;
    each(this.aNode.events, function (eventBind) {
        me._onEl(
            eventBind.name,
            bind(
                eventDeclarationListener,
                isComponent(me) ? me : me.owner,
                eventBind,
                0,
                me.data || me.scope
            )
        );
    });
};



/**
 * 处理自身变化时双绑的逻辑
 *
 * @private
 */
Element.prototype._initRootBindx = function () {
    var me = this;
    var xBinds = isComponent(me) ? this.props : this.binds;
    var data = isComponent(me) ? this.data : this.scope;

    xBinds && xBinds.each(function (bindInfo) {
        if (!bindInfo.x) {
            return;
        }

        var el = me._getEl();
        function outputer() {
            getPropHandler(me, bindInfo.name).output(me, bindInfo, data);
        };

        switch (bindInfo.name) {
            case 'value':
                switch (me.tagName) {
                    case 'input':
                    case 'textarea':
                        if (isBrowser && window.CompositionEvent) {
                            me._onEl('compositionstart', function () {
                                this.composing = 1;
                            });
                            me._onEl('compositionend', function () {
                                this.composing = 0;

                                var event = document.createEvent('HTMLEvents');
                                event.initEvent('input', true, true);
                                this.dispatchEvent(event);
                            });
                        }

                        me._onEl(
                            ('oninput' in el) ? 'input' : 'propertychange',
                            function (e) {
                                if (!this.composing) {
                                    outputer(e);
                                }
                            }
                        );

                        break;

                    case 'select':
                        me._onEl('change', outputer);
                        break;
                }
                break;

            case 'checked':
                switch (me.tagName) {
                    case 'input':
                        switch (el.type) {
                            case 'checkbox':
                            case 'radio':
                                me._onEl('click', outputer);
                        }
                }
                break;
        }

    });
};

/**
 * 将元素attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
Element.prototype.attach = function (parentEl, beforeEl) {
    if (!this.lifeCycle.is('attached')) {
        this._attach(parentEl, beforeEl);
        this._toAttached();
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
    if (parentEl) {
        if (beforeEl) {
            parentEl.insertBefore(this.el, beforeEl);
        }
        else {
            parentEl.appendChild(this.el);
        }
    }

    if (!this._contentReady) {
        var buf = new StringBuffer();
        genElementChildsHTML(this, buf);
        
        // html 没内容就不要设置 innerHTML了
        // 这里还能避免在 IE 下 component root 为 input 等元素时设置 innerHTML 报错的问题
        var html = buf.toString();
        if (html) {
            this.el.innerHTML = html;
        }

        this._contentReady = 1;
    }
};

/**
 * 为组件的 el 绑定事件
 *
 * @param {string} name 事件名
 * @param {Function} listener 监听器
 */
Element.prototype._onEl = function (name, listener) {
    if (typeof listener === 'function') {
        if (!this._elFns[name]) {
            this._elFns[name] = [];
        }
        this._elFns[name].push(listener);

        on(this._getEl(), name, listener);
    }
};


/**
 * 生成元素的html
 *
 * @param {StringBuffer} buf html串存储对象
 */
Element.prototype.genHTML = function (buf) {
    genElementStartHTML(this, buf);
    genElementChildsHTML(this, buf);
    genElementEndHTML(this, buf);
};

/**
 * 设置元素属性
 *
 * @param {string} name 属性名称
 * @param {*} value 属性值
 */
Element.prototype.setProp = function (name, value) {
    if (this.lifeCycle.is('created')) {
        getPropHandler(this, name).input.prop(this, name, value);
    }
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
Element.prototype.updateView = function (changes) {
    this._getEl();
    var me = this;

    this.props.each(function (prop) {
        each(changes, function (change) {
            if (!isDataChangeByElement(change, me, prop.name)
                && changeExprCompare(change.expr, prop.expr, me.scope)
            ) {
                me.setProp(prop.name, me.evalExpr(prop.expr));
                return false;
            }
        });
    });

    var htmlDirective = this.aNode.directives.get('html');
    if (htmlDirective) {
        each(changes, function (change) {
            if (changeExprCompare(change.expr, htmlDirective.value, me.scope)) {
                me.el.innerHTML = me.evalExpr(htmlDirective.value);
                return false;
            }
        });
    }
    else {
        this.updateChilds(changes);
    }
};

Element.prototype.updateChilds = function (changes, slotChildsName) {
    each(this.childs, function (child) {
        child.updateView(changes);
    });

    each(this[slotChildsName || 'slotChilds'], function (child) {
        Element.prototype.updateChilds.call(child, changes);
    });
};


/**
 * 将元素从页面上移除
 */
Element.prototype.detach = function () {
    if (this.lifeCycle.is('attached')) {
        this._detach();
        this._toPhase('detached');
    }
};

/**
 * 将元素从页面上移除的行为
 */
Element.prototype._detach = function () {
    removeEl(this._getEl());
};

/**
 * 销毁释放元素的行为
 */
Element.prototype._dispose = function () {
    this._disposeChilds();
    this.detach();

    // el 事件解绑
    for (var key in this._elFns) {
        var nameListeners = this._elFns[key];
        var len = nameListeners && nameListeners.length;

        while (len--) {
            un(this._getEl(), key, nameListeners[len]);
        }
    }
    this._elFns = null;

    this.childs = null;

    this.props = null;
    this.binds = null;

    // 这里不用挨个调用 dispose 了，因为 childs 释放链会调用的
    this.slotChilds = null;

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

// #[begin] reverse
/**
 * 添加子节点的 ANode
 * 用于从 el 初始化时，需要将解析的元素抽象成 ANode，并向父级注册
 *
 * @param {ANode} aNode 抽象节点对象
 */
Element.prototype._pushChildANode = function (aNode) {
    this.aNode.childs.push(aNode);
};
// #[end]


exports = module.exports = Element;
