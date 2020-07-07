/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file slot 节点类
 */

var each = require('../util/each');
var guid = require('../util/guid');
var extend = require('../util/extend');
var ExprType = require('../parser/expr-type');
var createAccessor = require('../parser/create-accessor');
var evalExpr = require('../runtime/eval-expr');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var insertBefore = require('../browser/insert-before');
var removeEl = require('../browser/remove-el');
var NodeType = require('./node-type');
var LifeCycle = require('./life-cycle');
var getANodeProp = require('./get-a-node-prop');
var nodeSBindInit = require('./node-s-bind-init');
var nodeSBindUpdate = require('./node-s-bind-update');
var createReverseNode = require('./create-reverse-node');
var elementDisposeChildren = require('./element-dispose-children');
var nodeOwnOnlyChildrenAttach = require('./node-own-only-children-attach');


/**
 * slot 节点类
 *
 * @class
 * @param {Object} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function SlotNode(aNode, parent, scope, owner, reverseWalker) {
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.id = guid++;

    this.lifeCycle = LifeCycle.start;
    this.children = [];

    // calc slot name
    this.nameBind = getANodeProp(aNode, 'name');
    if (this.nameBind) {
        this.isNamed = true;
        this.name = evalExpr(this.nameBind.expr, this.scope, this.owner);
    }

    // calc aNode children
    var sourceSlots = owner.sourceSlots;
    var matchedSlots;
    if (sourceSlots) {
        matchedSlots = this.isNamed ? sourceSlots.named[this.name] : sourceSlots.noname;
    }

    if (matchedSlots) {
        this.isInserted = true;
    }

    this.aNode = {
        directives: aNode.directives,
        props: [],
        events: [],
        children: matchedSlots || aNode.children.slice(0),
        vars: aNode.vars
    };

    this._sbindData = nodeSBindInit(aNode.directives.bind, this.scope, this.owner);

    // calc scoped slot vars
    var initData;
    if (this._sbindData) {
        initData = extend({}, this._sbindData);
    }

    if (aNode.vars) {
        initData = initData || {};
        each(aNode.vars, function (varItem) {
            initData[varItem.name] = evalExpr(varItem.expr, scope, owner);
        });
    }

    // child owner & child scope
    if (this.isInserted) {
        this.childOwner = owner.owner;
        this.childScope = matchedSlots.scope || owner.scope;
    }

    if (initData) {
        this.isScoped = true;
        this.childScope = new Data(initData, this.childScope || this.scope);
    }


    owner.slotChildren.push(this);

    // #[begin] reverse
    if (reverseWalker) {
        var hasFlagComment;

        // start flag
        if (reverseWalker.current && reverseWalker.current.nodeType === 8) {
            this.sel = reverseWalker.current;
            hasFlagComment = 1;
            reverseWalker.goNext();
        }
        else {
            this.sel = document.createComment(this.id);
            reverseWalker.current
                ? reverseWalker.target.insertBefore(this.sel, reverseWalker.current)
                : reverseWalker.target.appendChild(this.sel);
        }

        var aNodeChildren = this.aNode.children;
        for (var i = 0, l = aNodeChildren.length; i < l; i++) {
            this.children.push(createReverseNode(
                aNodeChildren[i],
                this,
                this.childScope || this.scope,
                this.childOwner || this.owner,
                reverseWalker
            ));
        }

        // end flag
        if (hasFlagComment) {
            this.el = reverseWalker.current;
            reverseWalker.goNext();
        }
        else {
            this.el = document.createComment(this.id);
            reverseWalker.current
                ? reverseWalker.target.insertBefore(this.el, reverseWalker.current)
                : reverseWalker.target.appendChild(this.el);
        }

        this.lifeCycle = LifeCycle.attached;
    }
    // #[end]
}

SlotNode.prototype.nodeType = NodeType.SLOT;

/**
 * 销毁释放 slot
 *
 * @param {boolean=} noDetach 是否不要把节点从dom移除
 * @param {boolean=} noTransition 是否不显示过渡动画效果
 */
SlotNode.prototype.dispose = function (noDetach, noTransition) {
    this.childOwner = null;
    this.childScope = null;

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

SlotNode.prototype.attach = nodeOwnOnlyChildrenAttach;

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 * @param {boolean=} isFromOuter 变化信息是否来源于父组件之外的组件
 * @return {boolean}
 */
SlotNode.prototype._update = function (changes, isFromOuter) {
    var me = this;

    if (this.nameBind && evalExpr(this.nameBind.expr, this.scope, this.owner) !== this.name) {
        this.owner._notifyNeedReload();
        return false;
    }

    if (isFromOuter) {
        if (this.isInserted) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i]._update(changes);
            }
        }
    }
    else {
        if (this.isScoped) {
            var varKeys = {};
            each(this.aNode.vars, function (varItem) {
                varKeys[varItem.name] = 1;
                me.childScope.set(varItem.name, evalExpr(varItem.expr, me.scope, me.owner));
            });

            var scopedChanges = [];

            this._sbindData = nodeSBindUpdate(
                this.aNode.directives.bind,
                this._sbindData,
                this.scope,
                this.owner,
                changes,
                function (name, value) {
                    if (varKeys[name]) {
                        return;
                    }

                    me.childScope.set(name, value);
                    scopedChanges.push({
                        type: DataChangeType.SET,
                        expr: createAccessor([
                            {type: ExprType.STRING, value: name}
                        ]),
                        value: value,
                        option: {}
                    });
                }
            );

            each(changes, function (change) {
                if (!me.isInserted) {
                    scopedChanges.push(change);
                }

                each(me.aNode.vars, function (varItem) {
                    var name = varItem.name;
                    var relation = changeExprCompare(change.expr, varItem.expr, me.scope);

                    if (relation < 1) {
                        return;
                    }

                    if (change.type !== DataChangeType.SPLICE) {
                        scopedChanges.push({
                            type: DataChangeType.SET,
                            expr: createAccessor([
                                {type: ExprType.STRING, value: name}
                            ]),
                            value: me.childScope.get(name),
                            option: change.option
                        });
                    }
                    else if (relation === 2) {
                        scopedChanges.push({
                            expr: createAccessor([
                                {type: ExprType.STRING, value: name}
                            ]),
                            type: DataChangeType.SPLICE,
                            index: change.index,
                            deleteCount: change.deleteCount,
                            value: change.value,
                            insertions: change.insertions,
                            option: change.option
                        });
                    }
                });
            });

            for (var i = 0; i < this.children.length; i++) {
                this.children[i]._update(scopedChanges);
            }
        }
        else if (!this.isInserted) {
            for (var i = 0; i < this.children.length; i++) {
                this.children[i]._update(changes);
            }
        }
    }
};

exports = module.exports = SlotNode;
