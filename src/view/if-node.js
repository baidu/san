/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file if 指令节点类
 */

var guid = require('../util/guid');
var insertBefore = require('../browser/insert-before');
var evalExpr = require('../runtime/eval-expr');
var NodeType = require('./node-type');
var createNode = require('./create-node');
var createHydrateNode = require('./create-hydrate-node');
var nodeOwnCreateStump = require('./node-own-create-stump');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');

/**
 * if 指令节点类
 *
 * @class
 * @param {Object} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker?} hydrateWalker 子元素遍历对象
 */
function IfNode(aNode, parent, scope, owner, hydrateWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.id = guid++;
    this.children = [];

    // #[begin] hydrate
    if (hydrateWalker) {
        if (evalExpr(this.aNode.directives['if'].value, this.scope, this.owner)) { // eslint-disable-line dot-notation
            this.elseIndex = -1;
            this.children[0] = createHydrateNode(
                this.aNode.ifRinsed,
                this,
                this.scope,
                this.owner,
                hydrateWalker
            );
        }
        else {
            var elses = aNode.elses;
            if (elses) {
                for (var i = 0, l = elses.length; i < l; i++) {
                    var elseANode = elses[i];
                    var elif = elseANode.directives.elif;

                    if (!elif || elif && evalExpr(elif.value, this.scope, this.owner)) {
                        this.elseIndex = i;
                        this.children[0] = createHydrateNode(
                            elseANode,
                            this,
                            this.scope,
                            this.owner,
                            hydrateWalker
                        );
                        break;
                    }
                }
            }
        }

        this._create();
        insertBefore(this.el, hydrateWalker.target, hydrateWalker.current);
    }
    // #[end]
}

IfNode.prototype.nodeType = NodeType.IF;

IfNode.prototype._create = nodeOwnCreateStump;
IfNode.prototype.dispose = nodeOwnSimpleDispose;

/**
 * attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
IfNode.prototype.attach = function (parentEl, beforeEl) {
    var elses = this.aNode.elses;
    var elseIndex;
    var child;

    if (evalExpr(this.aNode.directives['if'].value, this.scope, this.owner)) { // eslint-disable-line dot-notation
        child = createNode(this.aNode.ifRinsed, this, this.scope, this.owner);
        elseIndex = -1;
    }
    else if (elses) {
        for (var i = 0, l = elses.length; i < l; i++) {
            var elseANode = elses[i];
            var elif = elseANode.directives.elif;

            if (!elif || elif && evalExpr(elif.value, this.scope, this.owner)) {
                child = createNode(elseANode, this, this.scope, this.owner);
                elseIndex = i;
                break;
            }
        }
    }

    if (child) {
        this.children[0] = child;
        child.attach(parentEl, beforeEl);
        this.elseIndex = elseIndex;
    }


    this._create();
    insertBefore(this.el, parentEl, beforeEl);
};


/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
IfNode.prototype._update = function (changes) {
    var me = this;
    var childANode = this.aNode.ifRinsed;
    var elses = this.aNode.elses;
    var elseIndex;

    if (evalExpr(this.aNode.directives['if'].value, this.scope, this.owner)) { // eslint-disable-line dot-notation
        elseIndex = -1;
    }
    else if (elses) {
        for (var i = 0, l = elses.length; i < l; i++) {
            var elseANode = elses[i];
            var elif = elseANode.directives.elif;

            if (elif && evalExpr(elif.value, this.scope, this.owner) || !elif) {
                elseIndex = i;
                childANode = elseANode;
                break;
            }
        }
    }

    var child = this.children[0];
    if (elseIndex === this.elseIndex) {
        child && child._update(changes);
    }
    else {
        this.children = [];
        if (child) {
            child._ondisposed = newChild;
            child.dispose();
        }
        else {
            newChild();
        }

        this.elseIndex = elseIndex;
    }

    function newChild() {
        if (typeof elseIndex !== 'undefined') {
            (me.children[0] = createNode(childANode, me, me.scope, me.owner))
                .attach(me.el.parentNode, me.el);
        }
    }
};

IfNode.prototype._getElAsRootNode = function () {
    var child = this.children[0];
    return child && child.el || this.el;
};

exports = module.exports = IfNode;
