/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 元素节点类
 */


var changeExprCompare = require('../runtime/change-expr-compare');
var changesIsInDataRef = require('../runtime/changes-is-in-data-ref');
var evalExpr = require('../runtime/eval-expr');
var insertBefore = require('../browser/insert-before');
var LifeCycle = require('./life-cycle');
var NodeType = require('./node-type');
var baseProps = require('./base-props');
var reverseElementChildren = require('./reverse-element-children');
var isDataChangeByElement = require('./is-data-change-by-element');
var getPropHandler = require('./get-prop-handler');
var createNode = require('./create-node');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var elementOwnOnEl = require('./element-own-on-el');
var elementOwnAttached = require('./element-own-attached');
var nodeSBindInit = require('./node-s-bind-init');
var nodeSBindUpdate = require('./node-s-bind-update');
var warnSetHTML = require('./warn-set-html');
var getNodePath = require('./get-node-path');

/**
 * 元素节点类
 *
 * @class
 * @param {Object} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function Element(aNode, parent, scope, owner, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;

    this.lifeCycle = LifeCycle.start;
    this.children = [];
    this._elFns = [];
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.tagName = aNode.tagName;

    // #[begin] allua
    // ie8- 不支持innerHTML输出自定义标签
    /* istanbul ignore if */
    if (ieOldThan9 && this.tagName.indexOf('-') > 0) {
        this.tagName = 'div';
    }
    // #[end]

    nodeSBindInit(this, aNode.directives.bind);
    this.lifeCycle = LifeCycle.inited;

    // #[begin] reverse
    if (reverseWalker) {
        var currentNode = reverseWalker.current;

        /* istanbul ignore if */
        if (!currentNode) {
            throw new Error('[SAN REVERSE ERROR] Element not found. \nPaths: '
                + getNodePath(this).join(' > '));
        }

        /* istanbul ignore if */
        if (currentNode.nodeType !== 1) {
            throw new Error('[SAN REVERSE ERROR] Element type not match, expect 1 but '
                + currentNode.nodeType + '.\nPaths: '
                + getNodePath(this).join(' > '));
        }

        /* istanbul ignore if */
        if (currentNode.tagName.toLowerCase() !== this.tagName) {
            throw new Error('[SAN REVERSE ERROR] Element tagName not match, expect '
                + this.tagName + ' but meat ' + currentNode.tagName.toLowerCase() + '.\nPaths: '
                + getNodePath(this).join(' > '));
        }

        this.el = currentNode;
        reverseWalker.goNext();

        reverseElementChildren(this, this.scope, this.owner);

        this.lifeCycle = LifeCycle.created;
        this._attached();
        this.lifeCycle = LifeCycle.attached;
    }
    // #[end]
}



Element.prototype.nodeType = NodeType.ELEM;

/**
 * 将元素attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
Element.prototype.attach = function (parentEl, beforeEl) {
    if (!this.lifeCycle.attached) {
        if (!this.el) {
            var sourceNode = this.aNode.hotspot.sourceNode;
            var props = this.aNode.props;

            if (sourceNode) {
                this.el = sourceNode.cloneNode(false);
                props = this.aNode.hotspot.dynamicProps;
            }
            else {
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
                var propName = prop.name;
                var value = evalExpr(prop.expr, this.scope, this.owner);

                if (value || !baseProps[propName]) {
                    prop.handler(this.el, value, propName, this, prop);
                }
            }

            this.lifeCycle = LifeCycle.created;
        }
        insertBefore(this.el, parentEl, beforeEl);

        if (!this._contentReady) {
            var htmlDirective = this.aNode.directives.html;

            if (htmlDirective) {
                // #[begin] error
                warnSetHTML(this.el);
                // #[end]

                this.el.innerHTML = evalExpr(htmlDirective.value, this.scope, this.owner);
            }
            else {
                for (var i = 0, l = this.aNode.children.length; i < l; i++) {
                    var childANode = this.aNode.children[i];
                    var child = childANode.Clazz
                        ? new childANode.Clazz(childANode, this, this.scope, this.owner)
                        : createNode(childANode, this, this.scope, this.owner);
                    this.children.push(child);
                    child.attach(this.el);
                }
            }

            this._contentReady = 1;
        }

        this._attached();

        this.lifeCycle = LifeCycle.attached;
    }
};

Element.prototype.detach = elementOwnDetach;
Element.prototype.dispose = elementOwnDispose;
Element.prototype._onEl = elementOwnOnEl;
Element.prototype._leave = function () {
    if (this.leaveDispose) {
        if (!this.lifeCycle.disposed) {
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

            this.lifeCycle = LifeCycle.detached;

            this.el = null;
            this.owner = null;
            this.scope = null;
            this.children = null;
            this.lifeCycle = LifeCycle.disposed;

            if (this._ondisposed) {
                this._ondisposed();
            }
        }
    }
    else if (this.lifeCycle.attached) {
        removeEl(this.el);
        this.lifeCycle = LifeCycle.detached;
    }
};

/**
 * 视图更新
 *
 * @param {Array} changes 数据变化信息
 */
Element.prototype._update = function (changes) {
    var dataHotspot = this.aNode.hotspot.data;
    if (dataHotspot && changesIsInDataRef(changes, dataHotspot)) {

        // update s-bind
        var me = this;
        nodeSBindUpdate(
            this,
            this.aNode.directives.bind,
            changes,
            function (name, value) {
                if (name in me.aNode.hotspot.props) {
                    return;
                }

                getPropHandler(me.tagName, name)(me.el, value, name, me);
            }
        );

        // update prop
        var dynamicProps = this.aNode.hotspot.dynamicProps;
        for (var i = 0, l = dynamicProps.length; i < l; i++) {
            var prop = dynamicProps[i];
            var propName = prop.name;

            for (var j = 0, changeLen = changes.length; j < changeLen; j++) {
                var change = changes[j];

                if (!isDataChangeByElement(change, this, propName)
                    && (
                        changeExprCompare(change.expr, prop.expr, this.scope)
                        || prop.hintExpr && changeExprCompare(change.expr, prop.hintExpr, this.scope)
                    )
                ) {
                    prop.handler(this.el, evalExpr(prop.expr, this.scope, this.owner), propName, this, prop);
                    break;
                }
            }
        }

        // update content
        var htmlDirective = this.aNode.directives.html;
        if (htmlDirective) {
            var len = changes.length;
            while (len--) {
                if (changeExprCompare(changes[len].expr, htmlDirective.value, this.scope)) {
                    // #[begin] error
                    warnSetHTML(this.el);
                    // #[end]

                    this.el.innerHTML = evalExpr(htmlDirective.value, this.scope, this.owner);
                    break;
                }
            }
        }
        else {
            for (var i = 0, l = this.children.length; i < l; i++) {
                this.children[i]._update(changes);
            }
        }
    }
};

/**
 * 执行完成attached状态的行为
 */
Element.prototype._attached = elementOwnAttached;

exports = module.exports = Element;
