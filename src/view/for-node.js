/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file for 指令节点类
 */

var inherits = require('../util/inherits');
var each = require('../util/each');
var guid = require('../util/guid');
var ExprType = require('../parser/expr-type');
var parseExpr = require('../parser/parse-expr');
var createAccessor = require('../parser/create-accessor');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var evalExpr = require('../runtime/eval-expr');
var changesIsInDataRef = require('../runtime/changes-is-in-data-ref');
var insertBefore = require('../browser/insert-before');
var NodeType = require('./node-type');
var createNode = require('./create-node');
var createReverseNode = require('./create-reverse-node');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');
var nodeOwnCreateStump = require('./node-own-create-stump');


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
    this.parent = forElement.scope;
    this.raw = {};
    this.listeners = [];

    this.directive = forElement.aNode.directives['for']; // eslint-disable-line dot-notation
    this.indexName = this.directive.index || '$index';

    this.raw[this.directive.item] = item;
    this.raw[this.indexName] = index;
}

/**
 * 将数据操作的表达式，转换成为对parent数据操作的表达式
 * 主要是对item和index进行处理
 *
 * @param {Object} expr 表达式
 * @return {Object}
 */
ForItemData.prototype.exprResolve = function (expr) {
    var me = this;
    var directive = this.directive;

    function resolveItem(expr) {
        if (expr.type === ExprType.ACCESSOR && expr.paths[0].value === directive.item) {
            return createAccessor(
                directive.value.paths.concat(
                    {
                        type: ExprType.NUMBER,
                        value: me.raw[me.indexName]
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
            item.type === ExprType.ACCESSOR && item.paths[0].value === me.indexName
                ? {
                    type: ExprType.NUMBER,
                    value: me.raw[me.indexName]
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
            this.parent[method].apply(
                this.parent,
                [expr].concat(Array.prototype.slice.call(arguments, 1))
            );
        };
    }
);

/**
 * for 指令节点类
 *
 * @class
 * @param {Object} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function ForNode(aNode, parent, scope, owner, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = parent.nodeType === NodeType.CMPT
        ? parent
        : parent.parentComponent;

    this.id = guid++;
    this.children = [];

    this.param = aNode.directives['for']; // eslint-disable-line dot-notation

    this.itemPaths = [
        {
            type: ExprType.STRING,
            value: this.param.item
        }
    ];

    this.itemExpr = {
        type: ExprType.ACCESSOR,
        paths: this.itemPaths,
        raw: this.param.item
    };

    if (this.param.index) {
        this.indexExpr = createAccessor([{
            type: ExprType.STRING,
            value: '' + this.param.index
        }]);
    }


    // #[begin] reverse
    if (reverseWalker) {
        this.listData = evalExpr(this.param.value, this.scope, this.owner);
        if (this.listData instanceof Array) {
            for (var i = 0; i < this.listData.length; i++) {
                this.children.push(createReverseNode(
                    this.aNode.forRinsed,
                    this,
                    new ForItemData(this, this.listData[i], i),
                    this.owner,
                    reverseWalker
                ));
            }
        }
        else if (this.listData && typeof this.listData === 'object') {
            for (var i in this.listData) {
                if (this.listData.hasOwnProperty(i) && this.listData[i] != null) {
                    this.children.push(createReverseNode(
                        this.aNode.forRinsed,
                        this,
                        new ForItemData(this, this.listData[i], i),
                        this.owner,
                        reverseWalker
                    ));
                }
            }
        }

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
    this.listData = evalExpr(this.param.value, this.scope, this.owner);

    this._createChildren();
};

/**
 * 创建子元素
 */
ForNode.prototype._createChildren = function () {
    var parentEl = this.el.parentNode;
    var listData = this.listData;

    if (listData instanceof Array) {
        for (var i = 0; i < listData.length; i++) {
            var child = createNode(this.aNode.forRinsed, this, new ForItemData(this, listData[i], i), this.owner);
            this.children.push(child);
            child.attach(parentEl, this.el);
        }
    }
    else if (listData && typeof listData === 'object') {
        for (var i in listData) {
            if (listData.hasOwnProperty(i) && listData[i] != null) {
                var child = createNode(this.aNode.forRinsed, this, new ForItemData(this, listData[i], i), this.owner);
                this.children.push(child);
                child.attach(parentEl, this.el);
            }
        }
    }
};

/* eslint-disable fecs-max-statements */

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
ForNode.prototype._update = function (changes) {
    var listData = evalExpr(this.param.value, this.scope, this.owner);
    var oldIsArr = this.listData instanceof Array;
    var newIsArr = listData instanceof Array;

    if (this.children.length) {
        if (!listData || newIsArr && listData.length === 0) {
            this._disposeChildren();
            this.listData = listData;
        }
        else if (oldIsArr !== newIsArr || !newIsArr) {
            // 就是这么暴力
            // 不推荐使用for遍历object，用的话自己负责
            this.listData = listData;
            var me = this;
            this._disposeChildren(null, function () {
                me._createChildren();
            });
        }
        else {
            this._updateArray(changes, listData);
            this.listData = listData;
        }
    }
    else {
        this.listData = listData;
        this._createChildren();
    }
};

/**
 * 销毁释放子元素
 *
 * @param {Array?} children 要销毁的子元素，默认为自身的children
 * @param {Function} callback 释放完成的回调函数
 */
ForNode.prototype._disposeChildren = function (children, callback) {
    var parentEl = this.el.parentNode;
    var parentFirstChild = parentEl.firstChild;
    var parentLastChild = parentEl.lastChild;

    var len = this.children.length;

    var violentClear = !this.aNode.directives.transition
        && !children
        // 是否 parent 的唯一 child
        && len && parentFirstChild === this.children[0].el && parentLastChild === this.el
        ;

    if (!children) {
        children = this.children;
        this.children = [];
    }


    var disposedChildCount = 0;
    len = children.length;

    // 调用入口处已保证此处必有需要被删除的 child
    for (var i = 0; i < len; i++) {
        var disposeChild = children[i];

        if (violentClear) {
            disposeChild && disposeChild.dispose(violentClear, violentClear);
        }
        else if (disposeChild) {
            disposeChild._ondisposed = childDisposed;
            disposeChild.dispose();
        }
        else {
            childDisposed();
        }
    }

    if (violentClear) {
        // #[begin] allua
        /* istanbul ignore next */
        if (ie) {
            parentEl.innerHTML = '';
        }
        else {
            // #[end]
            parentEl.textContent = '';
            // #[begin] allua
        }
        // #[end]

        this.el = document.createComment(this.id);
        parentEl.appendChild(this.el);
        callback && callback();
    }

    function childDisposed() {
        disposedChildCount++;
        if (disposedChildCount >= len) {
            callback && callback();
        }
    }
};

ForNode.prototype.opti = typeof navigator !== 'undefined'
    && /chrome\/[0-9]+/i.test(navigator.userAgent);
/**
 * 数组类型的视图更新
 *
 * @param {Array} changes 数据变化信息
 * @param {Array} newList 新数组数据
 */
ForNode.prototype._updateArray = function (changes, newList) {
    var oldChildrenLen = this.children.length;
    var childrenChanges = new Array(oldChildrenLen);

    function pushToChildrenChanges(change) {
        for (var i = 0, l = childrenChanges.length; i < l; i++) {
            (childrenChanges[i] = childrenChanges[i] || []).push(change);
        }
        childrenNeedUpdate = null;
        isOnlyDispose = false;
    }

    var disposeChildren = [];

    // 控制列表是否整体更新的变量
    var isChildrenRebuild;

    //
    var isOnlyDispose = true;

    var childrenNeedUpdate = {};

    var newLen = newList.length;
    var getItemKey = this.aNode.hotspot.getForKey;

    /* eslint-disable no-redeclare */
    for (var cIndex = 0; cIndex < changes.length; cIndex++) {
        var change = changes[cIndex];
        var relation = changeExprCompare(change.expr, this.param.value, this.scope);

        if (!relation) {
            // 无关时，直接传递给子元素更新，列表本身不需要动
            pushToChildrenChanges(change);
        }
        else {
            if (relation > 2) {
                // 变更表达式是list绑定表达式的子项
                // 只需要对相应的子项进行更新
                var changePaths = change.expr.paths;
                var forLen = this.param.value.paths.length;
                var changeIndex = +evalExpr(changePaths[forLen], this.scope, this.owner);

                if (isNaN(changeIndex)) {
                    pushToChildrenChanges(change);
                }
                else if (!isChildrenRebuild) {
                    isOnlyDispose = false;
                    childrenNeedUpdate && (childrenNeedUpdate[changeIndex] = 1);

                    childrenChanges[changeIndex] = childrenChanges[changeIndex] || [];
                    if (this.param.index) {
                        childrenChanges[changeIndex].push(change);
                    }

                    change = change.type === DataChangeType.SET
                        ? {
                            type: change.type,
                            expr: createAccessor(
                                this.itemPaths.concat(changePaths.slice(forLen + 1))
                            ),
                            value: change.value,
                            option: change.option
                        }
                        : {
                            index: change.index,
                            deleteCount: change.deleteCount,
                            insertions: change.insertions,
                            type: change.type,
                            expr: createAccessor(
                                this.itemPaths.concat(changePaths.slice(forLen + 1))
                            ),
                            value: change.value,
                            option: change.option
                        };


                    childrenChanges[changeIndex].push(change);

                    if (change.type === DataChangeType.SET) {
                        if (this.children[changeIndex]) {
                            this.children[changeIndex].scope._set(
                                change.expr,
                                change.value,
                                {
                                    silent: 1
                                }
                            );
                        }
                        else {
                            // 设置数组项的索引可能超出数组长度，此时需要新增
                            // 比如当前数组只有2项，但是set list[4]
                            this.children[changeIndex] = 0;
                        }
                    }
                    else if (this.children[changeIndex]) {
                        this.children[changeIndex].scope._splice(
                            change.expr,
                            [].concat(change.index, change.deleteCount, change.insertions),
                            {
                                silent: 1
                            }
                        );
                    }
                }
            }
            else if (isChildrenRebuild) {
                continue;
            }
            else if (relation === 2 && change.type === DataChangeType.SPLICE
                && (this.owner.updateMode !== 'optimized' || !this.opti || this.aNode.directives.transition)
            ) {
                childrenNeedUpdate = null;

                // 变更表达式是list绑定表达式本身数组的splice操作
                // 此时需要删除部分项，创建部分项
                var changeStart = change.index;
                var deleteCount = change.deleteCount;
                var insertionsLen = change.insertions.length;
                var newCount = insertionsLen - deleteCount;

                if (newCount) {
                    var indexChange = this.param.index
                        ? {
                            type: DataChangeType.SET,
                            option: change.option,
                            expr: this.indexExpr
                        }
                        : null;

                    for (var i = changeStart + deleteCount; i < this.children.length; i++) {
                        if (indexChange) {
                            isOnlyDispose = false;
                            (childrenChanges[i] = childrenChanges[i] || []).push(indexChange);
                        }

                        var child = this.children[i];
                        if (child) {
                            child.scope.raw[child.scope.indexName] = i - deleteCount + insertionsLen;
                        }
                    }
                }

                var deleteLen = deleteCount;
                while (deleteLen--) {
                    if (deleteLen < insertionsLen) {
                        isOnlyDispose = false;
                        var i = changeStart + deleteLen;
                        // update
                        (childrenChanges[i] = childrenChanges[i] || []).push({
                            type: DataChangeType.SET,
                            option: change.option,
                            expr: this.itemExpr,
                            value: change.insertions[deleteLen]
                        });
                        if (this.children[i]) {
                            this.children[i].scope.raw[this.param.item] = change.insertions[deleteLen];
                        }
                    }
                }

                if (newCount < 0) {
                    disposeChildren = disposeChildren.concat(
                        this.children.splice(changeStart + insertionsLen, -newCount)
                    );
                    childrenChanges.splice(changeStart + insertionsLen, -newCount);
                }
                else if (newCount > 0) {
                    isOnlyDispose = false;
                    var spliceArgs = [changeStart + deleteCount, 0].concat(new Array(newCount));
                    this.children.splice.apply(this.children, spliceArgs);
                    childrenChanges.splice.apply(childrenChanges, spliceArgs);
                }
            }
            else {
                childrenNeedUpdate = null;
                isOnlyDispose = false;

                isChildrenRebuild = 1;

                // 变更表达式是list绑定表达式本身或母项的重新设值
                // 此时需要更新整个列表

                if (getItemKey && newLen && oldChildrenLen) {
                    // 如果设置了trackBy，用lis更新。开始 ====
                    var newListKeys = [];
                    var oldListKeys = [];
                    var newListKeysMap = {};
                    var oldListInNew = [];
                    var oldListKeyIndex = {};

                    for (var i = 0; i < newList.length; i++) {
                        var itemKey = getItemKey(newList[i]);
                        newListKeys.push(itemKey);
                        newListKeysMap[itemKey] = i;
                    };

                    for (var i = 0; i < this.listData.length; i++) {
                        var itemKey = getItemKey(this.listData[i]);

                        oldListKeys.push(itemKey);
                        oldListKeyIndex[itemKey] = i;

                        if (newListKeysMap[itemKey] != null) {
                            oldListInNew[i] = newListKeysMap[itemKey];
                        }
                        else {
                            oldListInNew[i] = -1;
                            disposeChildren.push(this.children[i]);
                        }
                    };

                    var newIndexStart = 0;
                    var newIndexEnd = newLen;
                    var oldIndexStart = 0;
                    var oldIndexEnd = oldChildrenLen;

                    while (newIndexStart < newLen
                        && oldIndexStart < oldChildrenLen
                        && newListKeys[newIndexStart] === oldListKeys[oldIndexStart]
                    ) {
                        if (this.listData[oldIndexStart] !== newList[newIndexStart]) {
                            this.children[oldIndexStart].scope.raw[this.param.item] = newList[newIndexStart];
                            (childrenChanges[oldIndexStart] = childrenChanges[oldIndexStart] || []).push({
                                type: DataChangeType.SET,
                                option: change.option,
                                expr: this.itemExpr,
                                value: newList[newIndexStart]
                            });
                        }

                        // 对list更上级数据的直接设置
                        if (relation < 2) {
                            (childrenChanges[oldIndexStart] = childrenChanges[oldIndexStart] || []).push(change);
                        }

                        newIndexStart++;
                        oldIndexStart++;
                    }

                    while (newIndexEnd > newIndexStart && oldIndexEnd > oldIndexStart
                        && newListKeys[newIndexEnd - 1] === oldListKeys[oldIndexEnd - 1]
                    ) {
                        newIndexEnd--;
                        oldIndexEnd--;

                        if (this.listData[oldIndexEnd] !== newList[newIndexEnd]) {
                            this.children[oldIndexEnd].scope.raw[this.param.item] = newList[newIndexEnd];
                            (childrenChanges[oldIndexEnd] = childrenChanges[oldIndexEnd] || []).push({
                                type: DataChangeType.SET,
                                option: change.option,
                                expr: this.itemExpr,
                                value: newList[newIndexEnd]
                            });
                        }

                        // 对list更上级数据的直接设置
                        if (relation < 2) {
                            (childrenChanges[oldIndexEnd] = childrenChanges[oldIndexEnd] || []).push(change);
                        }
                    }

                    var oldListLIS = [];
                    var lisIdx = [];
                    var lisPos = -1;
                    var lisSource = oldListInNew.slice(oldIndexStart, oldIndexEnd);
                    var len = oldIndexEnd - oldIndexStart;
                    var preIdx = new Array(len);

                    for (var i = 0; i < len; i++) {
                        var oldItemInNew = lisSource[i];
                        if (oldItemInNew === -1) {
                            continue;
                        }

                        var rePos = -1;
                        var rePosEnd = oldListLIS.length;

                        if (rePosEnd > 0 && oldListLIS[rePosEnd - 1] <= oldItemInNew) {
                            rePos = rePosEnd - 1;
                        }
                        else {
                            while (rePosEnd - rePos > 1) {
                                var mid = Math.floor((rePos + rePosEnd) / 2);
                                if (oldListLIS[mid] > oldItemInNew) {
                                    rePosEnd = mid;
                                } else {
                                    rePos = mid;
                                }
                            }
                        }

                        if (rePos !== -1) {
                            preIdx[i] = lisIdx[rePos];
                        }

                        if (rePos === lisPos) {
                            lisPos++;
                            oldListLIS[lisPos] = oldItemInNew;
                            lisIdx[lisPos] = i;
                        } else if (oldItemInNew < oldListLIS[rePos + 1]) {
                            oldListLIS[rePos + 1] = oldItemInNew;
                            lisIdx[rePos + 1] = i;
                        }
                    }

                    for (var i = lisIdx[lisPos]; lisPos >= 0; i = preIdx[i], lisPos--) {
                        oldListLIS[lisPos] = i;
                    }

                    var oldListLISPos = oldListLIS.length;
                    var staticPos = oldListLISPos ? oldListInNew[oldListLIS[--oldListLISPos] + oldIndexStart] : -1;

                    var newChildren = [];
                    var newChildrenChanges = [];

                    for (var i = newLen - 1; i >= 0; i--) {
                        if (i >= newIndexEnd) {
                            newChildren[i] = this.children[oldChildrenLen - newLen + i];
                            newChildrenChanges[i] = childrenChanges[oldChildrenLen - newLen + i];
                        }
                        else if (i < newIndexStart) {
                            newChildren[i] = this.children[i];
                            newChildrenChanges[i] = childrenChanges[i];
                        }
                        else {
                            var oldListIndex = oldListKeyIndex[newListKeys[i]];

                            if (i === staticPos) {
                                // 如果数据本身引用发生变化，设置变更
                                if (this.listData[oldListIndex] !== newList[i]) {
                                    this.children[oldListIndex].scope.raw[this.param.item] = newList[i];
                                    (childrenChanges[oldListIndex] = childrenChanges[oldListIndex] || []).push({
                                        type: DataChangeType.SET,
                                        option: change.option,
                                        expr: this.itemExpr,
                                        value: newList[i]
                                    });
                                }

                                // 对list更上级数据的直接设置
                                if (relation < 2) {
                                    (childrenChanges[oldListIndex] = childrenChanges[oldListIndex] || []).push(change);
                                }

                                newChildren[i] = this.children[oldListIndex];
                                newChildrenChanges[i] = childrenChanges[oldListIndex];

                                staticPos = oldListLISPos ? oldListInNew[oldListLIS[--oldListLISPos] + oldIndexStart] : -1;
                            }
                            else {
                                if (oldListIndex) {
                                    disposeChildren.push(this.children[oldListIndex]);
                                }

                                newChildren[i] = 0;
                                newChildrenChanges[i] = 0;
                            }

                        }
                    }

                    this.children = newChildren;
                    childrenChanges = newChildrenChanges;
                    // 如果设置了trackBy，用lis更新。结束 ====
                }
                else {
                    // 老的比新的多的部分，标记需要dispose
                    if (oldChildrenLen > newLen) {
                        disposeChildren = disposeChildren.concat(this.children.slice(newLen));
                        childrenChanges = childrenChanges.slice(0, newLen);
                        this.children = this.children.slice(0, newLen);
                    }

                    // 剩下的部分整项变更
                    for (var i = 0; i < newLen; i++) {
                        // 对list更上级数据的直接设置
                        if (relation < 2) {
                            (childrenChanges[i] = childrenChanges[i] || []).push(change);
                        }

                        if (this.children[i]) {
                            if (this.children[i].scope.raw[this.param.item] !== newList[i]) {
                                this.children[i].scope.raw[this.param.item] = newList[i];
                                (childrenChanges[i] = childrenChanges[i] || []).push({
                                    type: DataChangeType.SET,
                                    option: change.option,
                                    expr: this.itemExpr,
                                    value: newList[i]
                                });
                            }
                        }
                        else {
                            this.children[i] = 0;
                        }
                    }
                }
            }
        }

    }

    // 标记 length 是否发生变化
    if (newLen !== oldChildrenLen && this.param.value.paths) {
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

    // 执行视图更新，先删再刷新
    this._doCreateAndUpdate = doCreateAndUpdate;

    var me = this;
    if (disposeChildren.length === 0) {
        doCreateAndUpdate();
    }
    else {
        this._disposeChildren(disposeChildren, function () {
            if (doCreateAndUpdate === me._doCreateAndUpdate) {
                doCreateAndUpdate();
            }
        });
    }

    function doCreateAndUpdate() {
        me._doCreateAndUpdate = null;

        if (isOnlyDispose) {
            return;
        }

        var beforeEl = me.el;
        var parentEl = beforeEl.parentNode;

        // 对相应的项进行更新
        // 如果不attached则直接创建，如果存在则调用更新函数
        var j = -1;
        for (var i = 0; i < newLen; i++) {
            var child = me.children[i];

            if (child) {
                if (childrenChanges[i] && (!childrenNeedUpdate || childrenNeedUpdate[i])) {
                    child._update(childrenChanges[i]);
                }
            }
            else {
                if (j < i) {
                    j = i + 1;
                    beforeEl = null;
                    while (j < newLen) {
                        var nextChild = me.children[j];
                        if (nextChild) {
                            beforeEl = nextChild.sel || nextChild.el;
                            break;
                        }
                        j++;
                    }
                }

                me.children[i] = createNode(me.aNode.forRinsed, me, new ForItemData(me, newList[i], i), me.owner);
                me.children[i].attach(parentEl, beforeEl || me.el);
            }
        }
    }
};

exports = module.exports = ForNode;
