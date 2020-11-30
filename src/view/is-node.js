/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file is 指令节点类
 */

var guid = require('../util/guid');
var insertBefore = require('../browser/insert-before');
var evalExpr = require('../runtime/eval-expr');
var NodeType = require('./node-type');
var createNode = require('./create-node');
var createReverseNode = require('./create-reverse-node');
var nodeOwnCreateStump = require('./node-own-create-stump');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');

/**
 * is 指令节点类
 *
 * @class
 * @param {Object} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function IsNode(aNode, parent, scope, owner, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.id = guid++;

    // #[begin] reverse
    if (reverseWalker) {
        var tagName = evalExpr(this.aNode.directives['is'].value, this.scope, this.owner);
        if (tagName) { // eslint-disable-line dot-notation
            this.child = createReverseNode(
                this.aNode.isRinsed,
                this,
                this.scope,
                this.owner,
                reverseWalker
            );
        }

        this._create();
        insertBefore(this.el, reverseWalker.target, reverseWalker.current);
    }
    // #[end]
}

IsNode.prototype.nodeType = NodeType.IS;

IsNode.prototype._create = nodeOwnCreateStump;
IsNode.prototype.dispose = nodeOwnSimpleDispose;

/**
 * attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
IsNode.prototype.attach = function (parentEl, beforeEl) {
    var tagName = evalExpr(this.aNode.directives['is'].value, this.scope, this.owner);// eslint-disable-line dot-notation

    if (tagName) {
        var child = createNode(this.aNode.isRinsed, this, this.scope, this.owner);

        if (child) {
            this.tagName = tagName;
            this.child = child;
            child.attach(parentEl, beforeEl);
        }
    }

    this._create();
    insertBefore(this.el, parentEl, beforeEl);
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
IsNode.prototype._update = function (changes) {
    var me = this;
    var childANode = this.aNode.isRinsed;
    var child = this.child;
    var tagName = evalExpr(this.aNode.directives['is'].value, this.scope); // eslint-disable-line dot-notation

    if (tagName === this.tagName) {
        child && child._update(changes);
    }
    else {
        child._ondisposed = newChild;
            child.dispose();
    }

    function newChild() {
        me.child = createNode(childANode, me, me.scope, me.owner)
            .attach(me.el.parentNode, me.el);
    }
};

IsNode.prototype._getElAsRootNode = function () {
    var child = this.child;
    return child && child.el || this.el;
};

exports = module.exports = IsNode;
