/**
 * @file 创建 slot 元素
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var createANode = require('../parser/create-a-node');
var ExprType = require('../parser/expr-type');
var parseTemplate = require('../parser/parse-template');
var evalExpr = require('../runtime/eval-expr');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var removeEl = require('../browser/remove-el');
var NodeType = require('./node-type');
var attachings = require('./attachings');
var isEndStump = require('./is-end-stump');
var LifeCycle = require('./life-cycle');
var genElementChildrenHTML = require('./gen-element-children-html');
var nodeInit = require('./node-init');
var nodeDispose = require('./node-dispose');
var nodeEvalExpr = require('./node-eval-expr');
var createReverseNode = require('./create-reverse-node');
var elementDisposeChildren = require('./element-dispose-children');
var elementUpdateChildren = require('./element-update-children');
var elementOwnToPhase = require('./element-own-to-phase');
var nodeOwnSimpleAttached = require('./node-own-simple-attached');
var nodeOwnOnlyChildrenAttach = require('./node-own-only-children-attach');

/**
 * 创建 slot 元素
 *
 * @param {Object} options 初始化参数
 * @return {Object}
 */
function createSlot(options) {
    var aNode = createANode();

    // calc slot name
    options.nameBind = options.aNode.props.get('name');
    if (options.nameBind) {
        options.isNamed = true;
        options.name = nodeEvalExpr(options, options.nameBind.expr);
    }

    // calc aNode children
    var givenSlots = options.owner.givenSlots;
    var givenChildren;
    if (givenSlots) {
        givenChildren = options.isNamed ? givenSlots.named[options.name] : givenSlots.noname;
    }

    if (givenChildren) {
        options.isInserted = true;
    }

    aNode.children = givenChildren || options.aNode.children.slice(0);

    // calc scoped slot vars
    aNode.vars = options.aNode.vars;
    var initData = {};
    each(aNode.vars, function (varItem) {
        options.isScoped = true;
        initData[varItem.name] = evalExpr(varItem.expr, options.scope, options.owner);
    });

    // child owner & child scope
    if (options.isInserted) {
        options.childOwner = options.owner.owner;
        options.childScope = options.owner.scope;
    }

    if (options.isScoped) {
        options.childScope = new Data(initData, options.childScope || options.scope);
    }


    options.aNode = aNode;


    var node = nodeInit(options);
    node.lifeCycle = LifeCycle.start;
    node.children = [];
    node.nodeType = NodeType.SLOT;
    node.dispose = slotOwnDispose;
    node.attach = nodeOwnOnlyChildrenAttach;

    node._toPhase = elementOwnToPhase;
    node._getEl = slotOwnGetEl;
    node._attachHTML = slotOwnAttachHTML;
    node._attached = nodeOwnSimpleAttached;
    node._update = slotOwnUpdate;


    node.owner.slotChildren.push(node);

    // #[begin] reverse
    if (options.walker) {
        each(node.aNode.children, function (aNodeChild) {
            var child = createReverseNode(aNodeChild, options.walker, node);
            if (!child._static) {
                node.children.push(child);
            }
        });

        attachings.add(node);
    }
    // #[end]

    return node;
}

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 * @param {boolean=} isFromOuter 变化信息是否来源于父组件之外的组件
 * @return {boolean}
 */
function slotOwnUpdate(changes, isFromOuter) {
    var me = this;
    if (me.nameBind && nodeEvalExpr(me, me.nameBind.expr) !== me.name) {
        me.owner._notifyNeedReload();
        return false;
    }

    if (isFromOuter) {
        if (me.isInserted) {
            elementUpdateChildren(me, changes);
        }
    }
    else {
        if (me.isScoped) {
            each(me.aNode.vars, function (varItem) {
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
                            expr: {
                                type: ExprType.ACCESSOR,
                                paths: [
                                    {type: ExprType.STRING, value: name}
                                ]
                            },
                            value: me.childScope.get(name),
                            option: change.option
                        });
                    }
                    else if (relation === 2) {
                        scopedChanges.push({
                            expr: {
                                type: ExprType.ACCESSOR,
                                paths: [
                                    {type: ExprType.STRING, value: name}
                                ]
                            },
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

            elementUpdateChildren(me, scopedChanges);
        }
        else if (!me.isInserted) {
            elementUpdateChildren(me, changes);
        }
    }
}

/**
 * attach元素的html
 *
 * @param {Object} buf html串存储对象
 */
function slotOwnAttachHTML(buf) {
    genElementChildrenHTML(this, buf);
    attachings.add(this);
}

/**
 * 获取 slot 对应的主元素
 * slot 是片段的管理，没有主元素，所以直接返回爹的主元素，不持有引用
 *
 * @return {HTMLElement}
 */
function slotOwnGetEl() {
    return this.parent._getEl();
}

/**
 * 销毁释放 slot
 *
 * @param {Object=} options dispose行为参数
 */
function slotOwnDispose(options) {
    this.childOwner = null;
    this.childScope = null;

    elementDisposeChildren(this, options);
    nodeDispose(this);
}


exports = module.exports = createSlot;
