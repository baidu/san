/**
 * @file slot 节点类
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var guid = require('../util/guid');
var createANode = require('../parser/create-a-node');
var ExprType = require('../parser/expr-type');
var createAccessor = require('../parser/create-accessor');
var evalExpr = require('../runtime/eval-expr');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var htmlBufferComment = require('../runtime/html-buffer-comment');
var insertBefore = require('../browser/insert-before');
var NodeType = require('./node-type');
var attachings = require('./attachings');
var isComponent = require('./is-component');
var LifeCycle = require('./life-cycle');
var getANodeProp = require('./get-a-node-prop');
var genElementChildrenHTML = require('./gen-element-children-html');
var nodeDispose = require('./node-dispose');
var createReverseNode = require('./create-reverse-node');
var elementDisposeChildren = require('./element-dispose-children');
var elementUpdateChildren = require('./element-update-children');
var elementOwnToPhase = require('./element-own-to-phase');
var nodeOwnSimpleAttached = require('./node-own-simple-attached');
var nodeOwnOnlyChildrenAttach = require('./node-own-only-children-attach');
var nodeOwnGetStumpEl = require('./node-own-get-stump-el');
var nodeCreateStump = require('./node-create-stump');


/**
 * slot 节点类
 *
 * @param {Object} aNode 抽象节点
 * @param {Component} owner 所属组件环境
 * @param {Model=} scope 所属数据环境
 * @param {Node} parent 父亲节点
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function SlotNode(aNode, owner, scope, parent, reverseWalker) {
    var realANode = createANode();
    this.aNode = realANode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = isComponent(parent)
        ? parent
        : parent.parentComponent;

    this.id = guid();

    this.lifeCycle = LifeCycle.start;
    this.children = [];

    // calc slot name
    this.nameBind = getANodeProp(aNode, 'name');
    if (this.nameBind) {
        this.isNamed = true;
        this.name = evalExpr(this.nameBind.expr, this.scope, this.owner);
    }

    // calc aNode children
    var givenSlots = owner.givenSlots;
    var givenChildren;
    if (givenSlots) {
        givenChildren = this.isNamed ? givenSlots.named[this.name] : givenSlots.noname;
    }

    if (givenChildren) {
        this.isInserted = true;
    }

    realANode.children = givenChildren || aNode.children.slice(0);

    var me = this;

    // calc scoped slot vars
    realANode.vars = aNode.vars;
    var initData = {};
    each(realANode.vars, function (varItem) {
        me.isScoped = true;
        initData[varItem.name] = evalExpr(varItem.expr, scope, owner);
    });

    // child owner & child scope
    if (this.isInserted) {
        this.childOwner = owner.owner;
        this.childScope = owner.scope;
    }

    if (this.isScoped) {
        this.childScope = new Data(initData, this.childScope || this.scope);
    }


    owner.slotChildren.push(this);

    // #[begin] reverse
    if (reverseWalker) {

        this.sel = nodeCreateStump(this);
        insertBefore(this.sel, reverseWalker.target, reverseWalker.current);

        each(this.aNode.children, function (aNodeChild) {
            me.children.push(createReverseNode(aNodeChild, reverseWalker, me));
        });

        this.el = nodeCreateStump(this);
        insertBefore(this.el, reverseWalker.target, reverseWalker.current);

        attachings.add(this);
    }
    // #[end]
}

SlotNode.prototype.nodeType = NodeType.SLOT;

/**
 * 销毁释放 slot
 *
 * @param {Object=} options dispose行为参数
 */
SlotNode.prototype.dispose = function (options) {
    this.childOwner = null;
    this.childScope = null;

    elementDisposeChildren(this, options);
    nodeDispose(this);
};

SlotNode.prototype.attach = nodeOwnOnlyChildrenAttach;
SlotNode.prototype._toPhase = elementOwnToPhase;
SlotNode.prototype._getEl = nodeOwnGetStumpEl;
SlotNode.prototype._attached = nodeOwnSimpleAttached;

/**
 * attach元素的html
 *
 * @param {Object} buf html串存储对象
 */
SlotNode.prototype._attachHTML = function (buf) {
    htmlBufferComment(buf, this.id);
    genElementChildrenHTML(this, buf);
    htmlBufferComment(buf, this.id);

    attachings.add(this);
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 * @param {boolean=} isFromOuter 变化信息是否来源于父组件之外的组件
 * @return {boolean}
 */
SlotNode.prototype._update = function (changes, isFromOuter) {
    var me = this;

    if (this.nameBind && evalExpr(this.nameBind.expr, this.scope, this.owner) !== me.name) {
        this.owner._notifyNeedReload();
        return false;
    }

    if (isFromOuter) {
        if (this.isInserted) {
            elementUpdateChildren(this, changes);
        }
    }
    else {
        if (this.isScoped) {
            each(this.aNode.vars, function (varItem) {
                me.childScope.set(varItem.name, evalExpr(varItem.expr, me.scope, me.owner));
            });


            var scopedChanges = [];
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

                    if (change.type === DataChangeType.SET) {
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

            elementUpdateChildren(this, scopedChanges);
        }
        else if (!this.isInserted) {
            elementUpdateChildren(this, changes);
        }
    }
};

exports = module.exports = SlotNode;
