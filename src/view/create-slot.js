/**
 * @file 创建 slot 元素
 * @author errorrik(errorrik@gmail.com)
 */

var empty = require('../util/empty');
var createANode = require('../parser/create-a-node');
var NodeType = require('./node-type');
var isEndStump = require('./is-end-stump');
var genElementChildrenHTML = require('./gen-element-children-html');
var nodeInit = require('./node-init');
var nodeDispose = require('./node-dispose');
var createNodeByEl = require('./create-node-by-el');
var elementDisposeChildren = require('./element-dispose-children');
var elementOwnToPhase = require('./element-own-to-phase');
var elementOwnPushChildANode = require('./element-own-push-child-anode');
var nodeOwnSimpleAttached = require('./node-own-simple-attached');
var nodeOwnOnlyChildrenAttach = require('./node-own-only-children-attach');

/**
 * 创建 slot 元素
 *
 * @param {Object} options 初始化参数
 * @return {Object}
 */
function createSlot(options) {
    var literalOwner = options.owner;
    var aNode = createANode();

    // #[begin] reverse
    if (options.el) {
        if (options.stumpText.indexOf('!') !== 0) {
            options.isInserted = true;
            options.stumpText = options.stumpText.slice(1);
        }
        options.name = options.stumpText || '____';
    }
    else {
    // #[end]

        var nameBind = options.aNode.props.get('name');
        options.name = nameBind ? nameBind.raw : '____';

        var givenSlots = literalOwner.aNode.givenSlots;
        var givenChildren = givenSlots && givenSlots[options.name];
        aNode.children = givenChildren || options.aNode.children.slice(0);

        if (givenChildren) {
            options.isInserted = true;
        }

    // #[begin] reverse
    }
    // #[end]

    var initData = {};
    options.scopedProps = [];
    options.aNode.props.each(function (prop) {
        if (prop.name !== 'name') {
            options.isScoped = true;
            options.scopedProps.push(prop);
            initData[prop.name] = evalExpr(prop.expr, options.scope, literalOwner);
        }
    });

    if (options.isScoped) {
        options.realScope = new Data(initData);
        options.literalOwner = literalOwner;
        options.owner = literalOwner.owner;
    }
    else if (options.isInserted) {
        options.owner = literalOwner.owner;
        options.scope = literalOwner.scope;
    }


    options.aNode = aNode;


    var node = nodeInit(options);
    node.lifeCycle = LifeCycle.start;
    node.children = [];
    node._type = NodeType.SLOT;
    node.dispose = slotOwnDispose;
    node.attach = nodeOwnOnlyChildrenAttach;

    node._toPhase = elementOwnToPhase;
    node._getEl = slotOwnGetEl;
    node._attachHTML = slotOwnAttachHTML;
    node._attached = nodeOwnSimpleAttached;
    node._update = slotOwnUpdate;

    // #[begin] reverse
    node._pushChildANode = elementOwnPushChildANode;
    // #[end]

    if (options.isInserted && !options.isScoped) {
        var parent = node.parent;
        while (parent) {
            if (isComponent(parent) && parent.owner === node.owner) {
                parent.slotChildren.push(node);
                break;
            }

            parent = parent.parent;
        }
    }

    // #[begin] reverse
    if (options.el) {
        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (!next || isEndStump(next, 'slot')) {
                next && options.elWalker.goNext();
                break;
            }

            options.elWalker.goNext();
            var child = createNodeByEl(next, node, options.elWalker);
            node.children.push(child);
        }

        if (literalOwner !== node.owner) {
            literalOwner.aNode.givenSlots[node.name] = node.aNode;
        }
    }
    // #[end]

    return node;
}

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 * @param {boolean=} isFromOuter 变化信息是否来源于父组件之外的组件
 */
function slotOwnUpdate(changes, isFromOuter) {
    var me = this;
    if (me.isScoped) {
        each(me.scopedProps, function (prop) {
            me.realScope.set(prop.name, evalExpr(prop.expr, me.scope, me.literalOwner))
        });


        var scopedChanges = [];
        each(changes, function (change) {
            each(me.scopedProps, function (prop) {
                var relation = changeExprCompare(change.expr, prop.expr, me.scopeParent);

                if (relation < 1) {
                    return;
                }

                if (change.type === DataChangeType.SET) {
                    scopedChanges.push({
                        type: DataChangeType.SET,
                        expr: {
                            type: ExprType.ACCESSOR,
                            paths: [{type: ExprType.STRING, value:prop.name}]
                        },
                        value: me.realScope.get(prop.name),
                        option: change.option
                    });
                }
                else if (relation === 2) {
                    scopedChanges.push({
                        expr: {
                            type: ExprType.ACCESSOR,
                            paths: [{type: ExprType.STRING, value:prop.name}]
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
    else if (me.isInserted && isFromOuter || !me.isInserted) {
        elementUpdateChildren(me, changes);
    }
}

/**
 * attach元素的html
 *
 * @param {Object} buf html串存储对象
 */
function slotOwnAttachHTML(buf) {
    genElementChildrenHTML(this, buf, this.realScope);
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
 */
function slotOwnDispose(dontDetach) {
    this.realScope = null;
    this.literalOwner = null;

    elementDisposeChildren(this, dontDetach);
    nodeDispose(this);

    this._toPhase('disposed');
}


exports = module.exports = createSlot;
