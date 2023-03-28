/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file fragment 节点类
 */

var guid = require('../util/guid');
var insertBefore = require('../browser/insert-before');
var removeEl = require('../browser/remove-el');
var NodeType = require('./node-type');
var LifeCycle = require('./life-cycle');
var createHydrateNode = require('./create-hydrate-node');
var elementDisposeChildren = require('./element-dispose-children');
var nodeOwnOnlyChildrenAttach = require('./node-own-only-children-attach');

/**
 * fragment 节点类
 *
 * @class
 * @param {Object} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker?} hydrateWalker 子元素遍历对象
 */
function FragmentNode(aNode, parent, scope, owner, hydrateWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.id = guid++;
    this.lifeCycle = LifeCycle.start;
    this.children = [];

    // #[begin] hydrate
    if (hydrateWalker) {
        var hasFlagComment;

        // start flag
        if (hydrateWalker.current && hydrateWalker.current.nodeType === 8) {
            this.sel = hydrateWalker.current;
            hasFlagComment = 1;
            hydrateWalker.goNext();
        }
        else {
            this.sel = document.createComment(this.id);
            insertBefore(this.sel, hydrateWalker.target, hydrateWalker.current);
        }

        // content
        var aNodeChildren = this.aNode.children;
        for (var i = 0, l = aNodeChildren.length; i < l; i++) {
            this.children.push(
                createHydrateNode(aNodeChildren[i], this, this.scope, this.owner, hydrateWalker)
            );
        }

        // end flag
        if (hasFlagComment) {
            this.el = hydrateWalker.current;
            hydrateWalker.goNext();
        }
        else {
            this.el = document.createComment(this.id);
            insertBefore(this.el, hydrateWalker.target, hydrateWalker.current);
        }

        this.lifeCycle = LifeCycle.attached;
    }
    // #[end]
}



FragmentNode.prototype.nodeType = NodeType.FRAG;

FragmentNode.prototype.attach = nodeOwnOnlyChildrenAttach;

/**
 * 销毁释放
 *
 * @param {boolean=} noDetach 是否不要把节点从dom移除
 * @param {boolean=} noTransition 是否不显示过渡动画效果
 */
FragmentNode.prototype.dispose = function (noDetach, noTransition) {
    elementDisposeChildren(this.children, noDetach, noTransition);

    if (!noDetach) {
        removeEl(this.el);
        removeEl(this.sel);
    }

    this.sel = null;
    this.el = null;
    this.owner = null;
    this.scope = null;
    this.children = null;

    this.lifeCycle = LifeCycle.disposed;

    if (this._ondisposed) {
        this._ondisposed();
    }
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
FragmentNode.prototype._update = function (changes) {
    for (var i = 0; i < this.children.length; i++) {
        this.children[i]._update(changes);
    }
};

FragmentNode.prototype._getElAsRootNode = function () {
    return this.sel;
};

exports = module.exports = FragmentNode;
