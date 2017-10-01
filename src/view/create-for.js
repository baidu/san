/**
 * @file for指令处理类
 * @author errorrik(errorrik@gmail.com)
 */

var empty = require('../util/empty');
var extend = require('../util/extend');
var inherits = require('../util/inherits');
var each = require('../util/each');
var StringBuffer = require('../util/string-buffer');
var IndexedList = require('../util/indexed-list');
var genStumpHTML = require('./gen-stump-html');
var createNode = require('./create-node');
var createNodeByEl = require('./create-node-by-el');
var getNodeStump = require('./get-node-stump');
var isEndStump = require('./is-end-stump');
var getNodeStumpParent = require('./get-node-stump-parent');
var nodeOwnToPhase = require('./node-own-to-phase');
var warnSetHTML = require('./warn-set-html');
var parseTemplate = require('../parser/parse-template');
var createANode = require('../parser/create-a-node');
var ExprType = require('../parser/expr-type');
var parseExpr = require('../parser/parse-expr');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var removeEl = require('../browser/remove-el');
var ieOldThan9 = require('../browser/ie-old-than-9');

/**
 * 循环项的数据容器类
 *
 * @inner
 * @class
 * @param {Data} parent 父级数据容器
 * @param {Object} forDirective 循环指令信息
 * @param {*} item 当前项的数据
 * @param {number} index 当前项的索引
 */
function ForItemData(parent, forDirective, item, index) {
    Data.call(this, {}, parent);
    this.directive = forDirective;
    Data.prototype.set.call(this, forDirective.item, item);
    Data.prototype.set.call(this, forDirective.index, index);
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
            return {
                type: ExprType.ACCESSOR,
                paths: directive.list.paths.concat(
                    {
                        type: ExprType.NUMBER,
                        value: me.get(directive.index)
                    },
                    expr.paths.slice(1)
                )
            };
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

    return {
        type: ExprType.ACCESSOR,
        paths: resolvedPaths
    };
};

// 代理数据操作方法
inherits(ForItemData, Data);
each(
    ['set', 'remove', 'unshift', 'shift', 'push', 'pop', 'splice'],
    function (method) {
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
 * 创建 for 指令元素的子元素
 *
 * @inner
 * @param {ForDirective} forElement for 指令元素对象
 * @param {*} item 子元素对应数据
 * @param {number} index 子元素对应序号
 * @return {Element}
 */
function createForDirectiveChild(forElement, item, index) {
    var itemScope = new ForItemData(
        forElement.scope,
        forElement.aNode.directives.get('for'),
        item,
        index
    );

    return createNode(forElement.itemANode, forElement, itemScope);
}

/**
 * for 指令处理类
 *
 * @param {Object} options 初始化参数
 */
function createFor(options) {
    var node = nodeInit(options);
    node.childs = [];

    node.genHTML = forOwnGenHTML;
    node.updateView = forOwnUpdateView;
    node.create = forOwnCreate;
    node.detach = forOwnDetach;
    node.attach = forOwnAttach;
    node.dispose = forOwnDispose;
    node._toPhase = nodeOwnToPhase;
    node._getEl = forOwnGetEl;
    node._toAttached = nodeOwnToAttached;

    // #[begin] reverse
    node._pushChildANode = empty;
    // #[end]
    
    var aNode = node.aNode;

    // #[begin] reverse
    if (options.el) {
        aNode = parseTemplate(options.stumpText).childs[0];
        node.aNode = aNode;

        var index = 0;
        var directive = aNode.directives.get('for');
        var listData = nodeEvalExpr(node, directive.list) || [];

        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (isEndStump(next, 'for')) {
                removeEl(options.el);
                node.el = next;
                options.elWalker.goNext();
                break;
            }

            var itemScope = new ForItemData(node.scope, directive, listData[index], index);
            var child = createNodeByEl(next, node, options.elWalker, itemScope);
            node.childs.push(child);

            index++;
            options.elWalker.goNext();
        }

        node.parent._pushChildANode(node.aNode);
    }
    // #[end]

    node.itemANode = createANode({
        childs: aNode.childs,
        props: aNode.props,
        events: aNode.events,
        tagName: aNode.tagName,
        directives: (new IndexedList()).concat(aNode.directives)
    });
    node.itemANode.directives.remove('for');

    return node;
}

/**
 * 生成html
 *
 * @param {StringBuffer} buf html串存储对象
 * @param {boolean} onlyChilds 是否只生成列表本身html，不生成stump部分
 */
function forOwnGenHTML(buf, onlyChilds) {
    each(
        nodeEvalExpr(this, this.aNode.directives.get('for').list),
        function (item, i) {
            var child = createForDirectiveChild(this, item, i);
            this.childs.push(child);
            child.genHTML(buf);
        },
        this
    );

    if (!onlyChilds) {
        genStumpHTML(this, buf);
    }
}


/**
 * 将元素attach到页面的行为
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function forOwnAttach(parentEl, beforeEl) {
    if (this.lifeCycle.is('attached')) {
        return;
    }

    this.create();
    if (parentEl) {
        if (beforeEl) {
            parentEl.insertBefore(this.el, beforeEl);
        }
        else {
            parentEl.appendChild(this.el);
        }
    }

    // paint list
    var parentEl = getNodeStumpParent(this);
    var el = this._getEl() || parentEl.firstChild;
    var prevEl = el && el.previousSibling;
    var buf = new StringBuffer();

    prev: while (prevEl) {
        switch (prevEl.nodeType) {
            case 1:
                break prev;

            case 3:
                if (!/^\s*$/.test(prevEl.textContent)) {
                    break prev;
                }

                removeEl(prevEl);
                break;

        }

        prevEl = prevEl.previousSibling;
    }

    if (!prevEl) {
        this.genHTML(buf, 1);
        // #[begin] error
        warnSetHTML(parentEl);
        // #[end]
        parentEl.insertAdjacentHTML('afterbegin', buf.toString());
    }
    else if (prevEl.nodeType === 1) {
        this.genHTML(buf, 1);
        // #[begin] error
        warnSetHTML(parentEl);
        // #[end]
        prevEl.insertAdjacentHTML('afterend', buf.toString());
    }
    else {
        each(
            nodeEvalExpr(this, this.aNode.directives.get('for').list),
            function (item, i) {
                var child = createForDirectiveChild(this, item, i);
                this.childs.push(child);
                child.attach(parentEl, el);
            },
            this
        );
    }

    nodeToAttached(this);
};


/**
 * 将元素从页面上移除的行为
 */
function forOwnDetach() {
    if (this.lifeCycle.is('attached')) {
        elementDisposeChilds(this, true);
        removeEl(this._getEl());
        this.lifeCycle.set('detached');
    }
};

/**
 * 创建元素DOM行为
 */
function forOwnCreate() {
    if (!this.lifeCycle.is('created')) {
        this.el = this.el || document.createComment('san:' + this.id);
        this.lifeCycle.set('created');
    }
}

function forOwnDispose(dontDetach) {
    elementDisposeChilds(this, dontDetach);
    if (!dontDetach) {
        removeEl(this._getEl());
    }
    nodeDispose(this);
}


/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
 function forOwnUpdateView(changes) {
    var childsChanges = [];
    var oldChildsLen = this.childs.length;
    each(this.childs, function () {
        childsChanges.push([]);
    });

    var forDirective = this.aNode.directives.get('for');
    var parentEl = getNodeStumpParent(this);
    var disposeChilds = [];


    each(changes, function (change) {
        var relation = changeExprCompare(change.expr, forDirective.list, this.scope);

        if (!relation) {
            // 无关时，直接传递给子元素更新，列表本身不需要动
            each(childsChanges, function (childChanges) {
                childChanges.push(change);
            });
        }
        else if (relation > 2) {
            // 变更表达式是list绑定表达式的子项
            // 只需要对相应的子项进行更新
            var changePaths = change.expr.paths;
            var forLen = forDirective.list.paths.length;

            change = extend({}, change);
            change.expr = {
                type: ExprType.ACCESSOR,
                paths: forDirective.item.paths.concat(changePaths.slice(forLen + 1))
            };

            var changeIndex = +nodeEvalExpr(this, changePaths[forLen]);
            childsChanges[changeIndex].push(change);

            switch (change.type) {
                case DataChangeType.SET:
                    Data.prototype.set.call(
                        this.childs[changeIndex].scope,
                        change.expr,
                        change.value,
                        {silence: 1}
                    );
                    break;


                case DataChangeType.SPLICE:
                    Data.prototype.splice.call(
                        this.childs[changeIndex].scope,
                        change.expr,
                        [].concat(change.index, change.deleteCount, change.insertions),
                        {silence: 1}
                    );
                    break;
            }
        }
        else if (change.type === DataChangeType.SET) {
            // 变更表达式是list绑定表达式本身或母项的重新设值
            // 此时需要更新整个列表
            var oldLen = this.childs.length;
            var newList = nodeEvalExpr(this, forDirective.list);
            var newLen = newList.length;

            // 老的比新的多的部分，标记需要dispose
            if (oldLen > newLen) {
                disposeChilds = disposeChilds.concat(this.childs.slice(newLen));

                childsChanges.length = newLen;
                this.childs.length = newLen;
            }

            // 整项变更
            for (var i = 0; i < newLen; i++) {
                childsChanges[i] = [
                    {
                        type: DataChangeType.SET,
                        option: change.option,
                        expr: {
                            type: ExprType.ACCESSOR,
                            paths: forDirective.item.paths.slice(0)
                        },
                        value: newList[i]
                    }
                ];
                if (this.childs[i]) {
                    Data.prototype.set.call(
                        this.childs[i].scope,
                        forDirective.item,
                        newList[i],
                        {silence: 1}
                    );
                }
                else {
                    this.childs[i] = createForDirectiveChild(this, newList[i], i);
                }
            }
        }
        else if (relation === 2 && change.type === DataChangeType.SPLICE) {
            // 变更表达式是list绑定表达式本身数组的SPLICE操作
            // 此时需要删除部分项，创建部分项
            var changeStart = change.index;
            var deleteCount = change.deleteCount;

            var indexChange = {
                type: DataChangeType.SET,
                option: change.option,
                expr: forDirective.index
            };

            var insertionsLen = change.insertions.length;
            if (insertionsLen !== deleteCount) {
                each(this.childs, function (child, index) {
                    // update child index
                    if (index >= changeStart + deleteCount) {
                        childsChanges[index].push(indexChange);
                        Data.prototype.set.call(
                            child.scope,
                            indexChange.expr,
                            index - deleteCount + insertionsLen,
                            {silence: 1}
                        );
                    }
                }, this);
            }

            var spliceArgs = [changeStart, deleteCount];
            var childsChangesSpliceArgs = [changeStart, deleteCount];
            each(change.insertions, function (insertion, index) {
                spliceArgs.push(createForDirectiveChild(this, insertion, changeStart + index));
                childsChangesSpliceArgs.push([]);
            }, this);

            disposeChilds = disposeChilds.concat(this.childs.splice.apply(this.childs, spliceArgs));
            childsChanges.splice.apply(childsChanges, childsChangesSpliceArgs);
        }
    }, this);

    var newChildsLen = this.childs.length;

    // 标记 length 是否发生变化
    if (newChildsLen !== oldChildsLen) {
        var lengthChange = {
            type: DataChangeType.SET,
            option: {},
            expr: {
                type: ExprType.ACCESSOR,
                paths: forDirective.list.paths.concat({
                    type: ExprType.STRING,
                    value: 'length'
                })
            }
        };
        each(childsChanges, function (childChanges) {
            childChanges.push(lengthChange);
        });
    }

    
    // 清除应该干掉的 child
    var clearAll = newChildsLen === 0 && this.parent.childs.length === 1;

    each(disposeChilds, function (child) {
        var childEl = child._getEl();
        child.dispose(true);
        !clearAll && parentEl.removeChild(childEl);
    });

    if (clearAll) {
        parentEl.innerHTML = '';
        this.el = document.createComment('san:' + this.id);
        parentEl.appendChild(this.el);
        return;
    }


    // 对相应的项进行更新
    // 如果不attached则直接创建，如果存在则调用更新函数
    var attachStump = this;
    var newChildBuf;
    var newChilds;

    // for (var i = 0; i < newChildsLen; i++) {
    //     var child = this.childs[i];

    //     if (child.lifeCycle.is('attached')) {
    //         childsChanges[i].length && child.updateView(childsChanges[i]);
    //     }
    //     else {
    //         newChilds = newChilds || [];
    //         newChilds.push(child);
    //         newChildBuf = newChildBuf || new StringBuffer();
    //         child.genHTML(newChildBuf);

    //         var nextChild = this.childs[i + 1];
    //         if (!nextChild || nextChild.lifeCycle.is('attached')) {
    //             var beforeEl = nextChild && nextChild._getEl();
    //             if (!beforeEl) {
    //                 beforeEl = document.createElement('script');
    //                 parentEl.insertBefore(beforeEl, this._getEl());
    //             }
    //             beforeEl.insertAdjacentHTML('beforebegin', newChildBuf.toString());
    //             each(newChilds, function (newChild) {
    //                 newChild._toAttached();
    //             });
    //             newChildBuf = null;
    //             newChilds = null;
    //             if (!nextChild) {
    //                 parentEl.removeChild(beforeEl);
    //             }
    //         }
    //     }
    // }
    while (newChildsLen--) {
        var child = this.childs[newChildsLen];
        if (child.lifeCycle.is('attached')) {
            childsChanges[newChildsLen].length && child.updateView(childsChanges[newChildsLen]);
        }
        else {
            child.attach(parentEl, attachStump._getEl() || parentEl.firstChild);
        }

        attachStump = child;
    }
}

/**
 * 获取节点对应的主元素
 *
 * @protected
 * @return {HTMLElement}
 */
function forOwnGetEl() {
    return getNodeStump(this);
}


exports = module.exports = createFor;
