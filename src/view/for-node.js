/**
 * @file for 指令节点类
 * @author errorrik(errorrik@gmail.com)
 */

var inherits = require('../util/inherits');
var each = require('../util/each');
var guid = require('../util/guid');
var createANode = require('../parser/create-a-node');
var ExprType = require('../parser/expr-type');
var parseExpr = require('../parser/parse-expr');
var createAccessor = require('../parser/create-accessor');
var cloneDirectives = require('../parser/clone-directives');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var evalExpr = require('../runtime/eval-expr');
var changesIsInDataRef = require('../runtime/changes-is-in-data-ref');
var removeEl = require('../browser/remove-el');
var insertBefore = require('../browser/insert-before');
var LifeCycle = require('./life-cycle');
var NodeType = require('./node-type');
var createNode = require('./create-node');
var createReverseNode = require('./create-reverse-node');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');
var nodeOwnCreateStump = require('./node-own-create-stump');
var elementDisposeChildren = require('./element-dispose-children');
var dataCache = require('../runtime/data-cache');


/**
 * 循环项的数据容器类
 *
 * @inner
 * @class
 * @param {Object} forElement for元素对象
 * @param {*} item 当前项的数据
 * @param {number} index 当前项的索引
 */
function ForItemData(forElement, item, index) {
    this.id = guid();
    this.parent = forElement.scope;
    this.raw = {};
    this.listeners = [];

    this.directive = forElement.aNode.directives['for']; // eslint-disable-line dot-notation
    this.raw[this.directive.item.raw] = item;
    this.raw[this.directive.index.raw] = index;
}

/**
 * 将数据操作的表达式，转换成为对parent数据操作的表达式
 * 主要是对item和index进行处理
 *
 * @param {Object} expr 表达式
 * @return {Object}
 */
ForItemData.prototype.exprResolve = function (expr) {
    var directive = this.directive;
    var me = this;

    function resolveItem(expr) {
        if (expr.type === ExprType.ACCESSOR
            && expr.paths[0].value === directive.item.paths[0].value
        ) {
            return createAccessor(
                directive.value.paths.concat(
                    {
                        type: ExprType.NUMBER,
                        value: me.get(directive.index)
                    },
                    expr.paths.slice(1)
                )
            );
        }

        return expr;
    }

    expr = resolveItem(expr);

    var resolvedPaths = [];

    each(expr.paths, function (item) {
        resolvedPaths.push(
            item.type === ExprType.ACCESSOR
                && item.paths[0].value === directive.index.paths[0].value
            ? {
                type: ExprType.NUMBER,
                value: me.get(directive.index)
            }
            : resolveItem(item)
        );
    });

    return createAccessor(resolvedPaths);
};

// 代理数据操作方法
inherits(ForItemData, Data);
each(
    ['set', 'remove', 'unshift', 'shift', 'push', 'pop', 'splice'],
    function (method) {
        ForItemData.prototype['_' + method] = Data.prototype[method];
        ForItemData.prototype[method] = function (expr) {
            expr = this.exprResolve(parseExpr(expr));
            dataCache.clear();
            this.parent[method].apply(
                this.parent,
                [expr].concat(Array.prototype.slice.call(arguments, 1))
            );
        };
    }
);

/**
 * 创建 for 指令元素的子元素
 *
 * @inner
 * @param {ForDirective} forElement for 指令元素对象
 * @param {*} item 子元素对应数据
 * @param {number} index 子元素对应序号
 * @return {Element}
 */
function createForDirectiveChild(forElement, item, index) {
    var itemScope = new ForItemData(forElement, item, index);
    return createNode(forElement.itemANode, forElement, itemScope);
}

/**
 * for 指令节点类
 *
 * @param {Object} aNode 抽象节点
 * @param {Component} owner 所属组件环境
 * @param {Model=} scope 所属数据环境
 * @param {Node} parent 父亲节点
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function ForNode(aNode, owner, scope, parent, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.id = guid();
    this.children = [];

    this.itemANode = createANode({
        children: aNode.children,
        props: aNode.props,
        events: aNode.events,
        tagName: aNode.tagName,
        vars: aNode.vars,
        hotspot: aNode.hotspot,
        directives: cloneDirectives(aNode.directives, {
            'for': 1
        })
    });

    this.param = aNode.directives['for']; // eslint-disable-line dot-notation

    // #[begin] reverse
    if (reverseWalker) {
        var me = this;
        each(
            evalExpr(this.param.value, this.scope, this.owner),
            function (item, i) {
                var itemScope = new ForItemData(me, item, i);
                var child = createReverseNode(me.itemANode, reverseWalker, me, itemScope);
                me.children.push(child);
            }
        );

        this._create();
        insertBefore(this.el, reverseWalker.target, reverseWalker.current);
    }
    // #[end]
}


ForNode.prototype.nodeType = NodeType.FOR;
ForNode.prototype._create = nodeOwnCreateStump;
ForNode.prototype.dispose = nodeOwnSimpleDispose;

/**
 * 将元素attach到页面的行为
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
ForNode.prototype.attach = function (parentEl, beforeEl) {
    this._create();
    insertBefore(this.el, parentEl, beforeEl);

    // paint list
    var el = this.el || parentEl.firstChild;
    var data = evalExpr(this.param.value, this.scope, this.owner);
    var len = data && data.length || 0;
    for (var i = 0; i < len; i++) {
        var child = createForDirectiveChild(this, data[i], i);
        this.children.push(child);
        child.attach(parentEl, el);
    }
};

/**
 * 将元素从页面上移除的行为
 */
ForNode.prototype.detach = function () {
    if (this.lifeCycle.attached) {
        elementDisposeChildren(this);
        this.children = [];
        removeEl(this.el);
        this.lifeCycle = LifeCycle.detached;
    }
};

/* eslint-disable fecs-max-statements */

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
ForNode.prototype._update = function (changes) {

    var me = this;
    // 控制列表更新策略是否原样更新的变量
    var originalUpdate = this.aNode.directives.transition;


    var oldChildrenLen = this.children.length;
    var childrenChanges = new Array(oldChildrenLen);

    function pushToChildrenChanges(change) {
        for (var i = 0, l = childrenChanges.length; i < l; i++) {
            (childrenChanges[i] = childrenChanges[i] || []).push(change);
        }
    }

    var disposeChildren = [];


    // 判断列表是否父元素下唯一的元素
    // 如果是的话，可以做一些更新优化
    var parentEl = this.el.parentNode;
    var parentFirstChild = parentEl.firstChild;
    var parentLastChild = parentEl.lastChild;
    var isOnlyParentChild = oldChildrenLen > 0 // 有孩子时
            && parentFirstChild === this.children[0].el
            && (parentLastChild === this.el || parentLastChild === this.children[oldChildrenLen - 1].el)
        || oldChildrenLen === 0 // 无孩子时
            && parentFirstChild === this.el
            && parentLastChild === this.el;

    // 控制列表是否整体更新的变量
    var isChildrenRebuild;

    var newList = evalExpr(this.param.value, this.scope, this.owner);
    var newLen = newList && newList.length || 0;

    /* eslint-disable no-redeclare */
    for (var cIndex = 0, cLen = changes.length; cIndex < cLen; cIndex++) {
        var change = changes[cIndex];
        var relation = changeExprCompare(change.expr, this.param.value, this.scope);

        if (!relation) {
            // 无关时，直接传递给子元素更新，列表本身不需要动
            pushToChildrenChanges(change);
        }
        else if (relation > 2) {
            // 变更表达式是list绑定表达式的子项
            // 只需要对相应的子项进行更新
            var changePaths = change.expr.paths;
            var forLen = this.param.value.paths.length;
            var changeIndex = +evalExpr(changePaths[forLen], this.scope, this.owner);

            if (isNaN(changeIndex)) {
                pushToChildrenChanges(change);
            }
            else {
                change = {
                    type: change.type,
                    expr: createAccessor(
                        this.param.item.paths.concat(changePaths.slice(forLen + 1))
                    ),
                    value: change.value,
                    index: change.index,
                    deleteCount: change.deleteCount,
                    insertions: change.insertions,
                    option: change.option
                };

                (childrenChanges[changeIndex] = childrenChanges[changeIndex] || [])
                    .push(change);

                if (this.children[changeIndex]) {
                    if (change.type === DataChangeType.SPLICE) {
                        this.children[changeIndex].scope._splice(
                            change.expr,
                            [].concat(change.index, change.deleteCount, change.insertions),
                            { silent: 1 }
                        );
                    }
                    else {
                        this.children[changeIndex].scope._set(
                            change.expr,
                            change.value,
                            { silent: 1 }
                        );
                    }
                }
            }
        }
        else if (change.type !== DataChangeType.SPLICE) {
            // 变更表达式是list绑定表达式本身或母项的重新设值
            // 此时需要更新整个列表


            // 老的比新的多的部分，标记需要dispose
            if (oldChildrenLen > newLen) {
                disposeChildren = disposeChildren.concat(this.children.slice(newLen));

                childrenChanges = childrenChanges.slice(0, newLen);
                this.children = this.children.slice(0, newLen);
            }

            // 整项变更
            for (var i = 0; i < newLen; i++) {
                (childrenChanges[i] = childrenChanges[i] || []).push({
                    type: DataChangeType.SET,
                    option: change.option,
                    expr: createAccessor(this.param.item.paths.slice(0)),
                    value: newList[i]
                });

                // 对list更上级数据的直接设置
                if (relation < 2) {
                    childrenChanges[i].push(change);
                }

                if (this.children[i]) {
                    this.children[i].scope._set(
                        this.param.item,
                        newList[i],
                        {silent: 1}
                    );
                }
                else {
                    this.children[i] = 0;
                }
            }

            isChildrenRebuild = 1;
        }
        else if (relation === 2 && change.type === DataChangeType.SPLICE && !isChildrenRebuild) {
            // 变更表达式是list绑定表达式本身数组的splice操作
            // 此时需要删除部分项，创建部分项
            var changeStart = change.index;
            var deleteCount = change.deleteCount;
            var insertionsLen = change.insertions.length;
            var newCount = insertionsLen - deleteCount;

            if (newCount) {
                var indexChange = {
                    type: DataChangeType.SET,
                    option: change.option,
                    expr: this.param.index
                };

                for (var i = changeStart + deleteCount; i < this.children.length; i++) {
                    (childrenChanges[i] = childrenChanges[i] || []).push(indexChange);
                    this.children[i] && this.children[i].scope._set(
                        indexChange.expr,
                        i - deleteCount + insertionsLen,
                        {silent: 1}
                    );
                }
            }

            var deleteLen = deleteCount;
            while (deleteLen--) {
                if (deleteLen < insertionsLen) {
                    var i = changeStart + deleteLen;
                    // update
                    (childrenChanges[i] = childrenChanges[i] || []).push({
                        type: DataChangeType.SET,
                        option: change.option,
                        expr: createAccessor(this.param.item.paths.slice(0)),
                        value: change.insertions[deleteLen]
                    });
                    if (this.children[i]) {
                        this.children[i].scope._set(
                            this.param.item,
                            change.insertions[deleteLen],
                            {silent: 1}
                        );
                    }
                }
            }

            if (newCount < 0) {
                disposeChildren = disposeChildren.concat(this.children.splice(changeStart + insertionsLen, -newCount));
                childrenChanges.splice(changeStart + insertionsLen, -newCount);
            }
            else if (newCount > 0) {
                var spliceArgs = [changeStart + deleteCount, 0].concat(new Array(newCount));
                this.children.splice.apply(this.children, spliceArgs);
                childrenChanges.splice.apply(childrenChanges, spliceArgs);
            }
        }
    }

    var newChildrenLen = this.children.length;

    // 标记 length 是否发生变化
    if (newChildrenLen !== oldChildrenLen) {
        var lengthChange = {
            type: DataChangeType.SET,
            option: {},
            expr: createAccessor(
                this.param.value.paths.concat({
                    type: ExprType.STRING,
                    value: 'length'
                })
            )
        };

        if (changesIsInDataRef([lengthChange], this.aNode.hotspot.data)) {
            pushToChildrenChanges(lengthChange);
        }
    }

    // 清除应该干掉的 child
    this._doCreateAndUpdate = doCreateAndUpdate;

    // 这里不用getTransition，getTransition和scope相关，for和forItem的scope是不同的
    // 所以getTransition结果本身也是不一致的。不如直接判断指令是否存在，如果存在就不进入暴力清除模式
    // var violentClear = isOnlyParentChild && newChildrenLen === 0 && !elementGetTransition(me);
    var violentClear = !originalUpdate && isOnlyParentChild && newChildrenLen === 0;

    var disposedChildCount = 0;
    for (var i = 0; i < disposeChildren.length; i++) {
        var disposeChild = disposeChildren[i];
        if (disposeChild) {
            disposeChild._ondisposed = childDisposed;
            disposeChild.dispose(violentClear, violentClear);
        }
        else {
            childDisposed();
        }
    }

    if (violentClear) {
        // cloneNode + replaceChild is faster
        // parentEl.innerHTML = '';
        var replaceNode = parentEl.cloneNode(false);
        parentEl.parentNode.replaceChild(replaceNode, parentEl);
        this.el = document.createComment(this.id);
        replaceNode.appendChild(this.el);
    }

    if (disposeChildren.length === 0) {
        doCreateAndUpdate();
    }


    function childDisposed() {
        disposedChildCount++;
        if (disposedChildCount === disposeChildren.length
            && doCreateAndUpdate === me._doCreateAndUpdate
        ) {
            doCreateAndUpdate();
        }
    }

    function doCreateAndUpdate() {
        me._doCreateAndUpdate = null;
        if (violentClear) {
            return;
        }


        var beforeEl = me.el;

        // 对相应的项进行更新
        if (oldChildrenLen === 0 && isOnlyParentChild) {
            for (var i = 0; i < newChildrenLen; i++) {
                me.children[i] = createForDirectiveChild(me, newList[i], i);
                me.children[i].attach(parentEl, beforeEl);
            }
        }
        else {
            // 如果不attached则直接创建，如果存在则调用更新函数
            var j = -1;
            for (var i = 0; i < newChildrenLen; i++) {
                var child = me.children[i];

                if (child) {
                    childrenChanges[i] && child._update(childrenChanges[i]);
                }
                else {
                    if (j < i) {
                        j = i + 1;
                        beforeEl = null;
                        while (j < newChildrenLen) {
                            var nextChild = me.children[j];
                            if (nextChild) {
                                beforeEl = nextChild.sel || nextChild.el;
                                break;
                            }
                            j++;
                        }
                    }

                    me.children[i] = createForDirectiveChild(me, newList[i], i);
                    me.children[i].attach(parentEl, beforeEl || me.el);
                }
            }
        }
    }
};


exports = module.exports = ForNode;
