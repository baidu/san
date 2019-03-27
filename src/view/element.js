/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 元素节点类
 */


var guid = require('../util/guid');
var changeExprCompare = require('../runtime/change-expr-compare');
var changesIsInDataRef = require('../runtime/changes-is-in-data-ref');
var evalExpr = require('../runtime/eval-expr');
var insertBefore = require('../browser/insert-before');
var LifeCycle = require('./life-cycle');
var NodeType = require('./node-type');
var reverseElementChildren = require('./reverse-element-children');
var isDataChangeByElement = require('./is-data-change-by-element');
var getPropHandler = require('./get-prop-handler');
var createNode = require('./create-node');
var elementOwnCreate = require('./element-own-create');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var elementOwnOnEl = require('./element-own-on-el');
var elementOwnAttached = require('./element-own-attached');
var elementOwnLeave = require('./element-own-leave');
var elementInitTagName = require('./element-init-tag-name');
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

    elementInitTagName(this);

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

        this._attached();
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
                        getPropHandler(this.tagName, key).prop(
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

                if (value || !emptyPropWhenCreate[propName]) {
                    getPropHandler(this.tagName, propName).prop(this.el, value, propName, this, prop);
                }
            }

            this._toPhase('created');
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
                    var child = createNode(childANode, this, this.scope, this.owner);
                    this.children.push(child);
                    child.attach(this.el);
                }
            }

            this._contentReady = 1;
        }

        this._attached();
    }
};

Element.prototype.detach = elementOwnDetach;
Element.prototype.dispose = elementOwnDispose;
Element.prototype._create = elementOwnCreate;
Element.prototype._onEl = elementOwnOnEl;
Element.prototype._leave = elementOwnLeave;

Element.prototype._toPhase = function (name) {
    this.lifeCycle = LifeCycle[name];
};

/**
 * 视图更新
 *
 * @param {Array} changes 数据变化信息
 */
Element.prototype._update = function (changes) {
    if (!changesIsInDataRef(changes, this.aNode.hotspot.data)) {
        return;
    }

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

            getPropHandler(me.tagName, name).prop(me.el, value, name, me);
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
                getPropHandler(this.tagName, propName)
                    .prop(this.el, evalExpr(prop.expr, this.scope, this.owner), propName, this, prop);
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
};

/**
 * 执行完成attached状态的行为
 */
Element.prototype._attached = elementOwnAttached;

exports = module.exports = Element;
