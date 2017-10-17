/**
 * @file 创建 for 指令元素
 * @author errorrik(errorrik@gmail.com)
 */

var empty = require('../util/empty');
var extend = require('../util/extend');
var inherits = require('../util/inherits');
var each = require('../util/each');
var IndexedList = require('../util/indexed-list');
var parseTemplate = require('../parser/parse-template');
var createANode = require('../parser/create-a-node');
var ExprType = require('../parser/expr-type');
var parseExpr = require('../parser/parse-expr');
var Data = require('../runtime/data');
var DataChangeType = require('../runtime/data-change-type');
var changeExprCompare = require('../runtime/change-expr-compare');
var createStrBuffer = require('../runtime/create-str-buffer');
var stringifyStrBuffer = require('../runtime/stringify-str-buffer');
var removeEl = require('../browser/remove-el');

var attachings = require('./attachings');
var genStumpHTML = require('./gen-stump-html');
var nodeInit = require('./node-init');
var NodeType = require('./node-type');
var nodeEvalExpr = require('./node-eval-expr');
var createNode = require('./create-node');
var createNodeByEl = require('./create-node-by-el');
var isEndStump = require('./is-end-stump');
var getNodeStumpParent = require('./get-node-stump-parent');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');
var nodeOwnCreateStump = require('./node-own-create-stump');
var nodeOwnGetStumpEl = require('./node-own-get-stump-el');
var elementDisposeChilds = require('./element-dispose-childs');
var warnSetHTML = require('./warn-set-html');


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

    this.directive = forElement.aNode.directives.get('for');
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
    var itemScope = new ForItemData(forElement, item, index);
    return createNode(forElement.itemANode, forElement, itemScope);
}

/**
 * 创建 for 指令元素
 *
 * @param {Object} options 初始化参数
 * @return {Object}
 */
function createFor(options) {
    var node = nodeInit(options);
    node.childs = [];
    node._type = NodeType.FOR;

    node.attach = forOwnAttach;
    node.detach = forOwnDetach;
    node.dispose = nodeOwnSimpleDispose;

    node._attachHTML = forOwnAttachHTML;
    node._update = forOwnUpdate;
    node._create = nodeOwnCreateStump;
    node._getEl = nodeOwnGetStumpEl;

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

            var itemScope = new ForItemData(node, listData[index], index);
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
 * attach元素的html
 *
 * @param {Object} buf html串存储对象
 * @param {boolean} onlyChilds 是否只attach列表本身html，不包括stump部分
 */
function forOwnAttachHTML(buf, onlyChilds) {
    var me = this;
    each(
        nodeEvalExpr(me, me.aNode.directives.get('for').list),
        function (item, i) {
            var child = createForDirectiveChild(me, item, i);
            me.childs.push(child);
            child._attachHTML(buf);
        }
    );

    if (!onlyChilds) {
        genStumpHTML(me, buf);
    }
}


/**
 * 将元素attach到页面的行为
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function forOwnAttach(parentEl, beforeEl) {
    this._create();
    if (parentEl) {
        if (beforeEl) {
            parentEl.insertBefore(this.el, beforeEl);
        }
        else {
            parentEl.appendChild(this.el);
        }
    }

    // paint list
    var el = this.el || parentEl.firstChild;
    var prevEl = el && el.previousSibling;
    var buf = createStrBuffer();

    prev: while (prevEl) {
        var nextPrev = prevEl.previousSibling;
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

        prevEl = nextPrev;
    }

    if (!prevEl) {
        this._attachHTML(buf, 1);
        // #[begin] error
        warnSetHTML(parentEl);
        // #[end]
        parentEl.insertAdjacentHTML('afterbegin', stringifyStrBuffer(buf));
    }
    else if (prevEl.nodeType === 1) {
        this._attachHTML(buf, 1);
        // #[begin] error
        warnSetHTML(parentEl);
        // #[end]
        prevEl.insertAdjacentHTML('afterend', stringifyStrBuffer(buf));
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

    attachings.done();
}


/**
 * 将元素从页面上移除的行为
 */
function forOwnDetach() {
    if (this.lifeCycle.is('attached')) {
        elementDisposeChilds(this, true);
        removeEl(this._getEl());
        this.lifeCycle.set('detached');
    }
}



/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
function forOwnUpdate(changes) {
    var childsChanges = [];
    var oldChildsLen = this.childs.length;
    each(this.childs, function () {
        childsChanges.push([]);
    });


    var disposeChilds = [];
    var forDirective = this.aNode.directives.get('for');

    this._getEl();
    var parentEl = getNodeStumpParent(this);
    var parentFirstChild = parentEl.firstChild;
    var parentLastChild = parentEl.lastChild;

    var isOnlyParentChild =
        oldChildsLen > 0 // 有孩子时
            && parentFirstChild === this.childs[0]._getEl()
            && (parentLastChild === this.el || parentLastChild === this.childs[oldChildsLen - 1]._getEl())
        || oldChildsLen === 0 // 无孩子时
            && parentFirstChild === this.el
            && parentLastChild === this.el


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
            var newLen = newList && newList.length || 0;

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

                // 对list更上级数据的直接设置
                if (relation < 2) {
                    childsChanges[i].push(change);
                }

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
    var violentClear = isOnlyParentChild && newChildsLen === 0;

    each(disposeChilds, function (child) {
        child.dispose(violentClear);
    });

    if (violentClear) {
        parentEl.innerHTML = '';
        this.el = document.createComment('san:' + this.id);
        parentEl.appendChild(this.el);
        return;
    }


    // 对相应的项进行更新
    if (oldChildsLen === 0 && isOnlyParentChild) {
        var buf = createStrBuffer();
        each(
            this.childs,
            function (child) {
                child._attachHTML(buf);
            }
        );
        parentEl.innerHTML = stringifyStrBuffer(buf);
        this.el = document.createComment('san:' + this.id);
        parentEl.appendChild(this.el);
    }
    else {
        // 如果不attached则直接创建，如果存在则调用更新函数

        // var attachStump = this;

        // while (newChildsLen--) {
        //     var child = this.childs[newChildsLen];
        //     if (child.lifeCycle.is('attached')) {
        //         childsChanges[newChildsLen].length && child._update(childsChanges[newChildsLen]);
        //     }
        //     else {
        //         child.attach(parentEl, attachStump._getEl() || parentEl.firstChild);
        //     }

        //     attachStump = child;
        // }

        var newChildBuf;

        for (var i = 0; i < newChildsLen; i++) {
            var child = this.childs[i];

            if (child.lifeCycle.is('attached')) {
                childsChanges[i].length && child._update(childsChanges[i]);
            }
            else {
                newChildBuf = newChildBuf || createStrBuffer();
                child._attachHTML(newChildBuf);

                // flush new childs html
                var nextChild = this.childs[i + 1];
                if (!nextChild || nextChild.lifeCycle.is('attached')) {
                    var beforeEl = nextChild && nextChild._getEl();
                    if (!beforeEl) {
                        beforeEl = document.createElement('script');
                        parentEl.insertBefore(beforeEl, this.el || parentEl.firstChild);
                    }
                    beforeEl.insertAdjacentHTML('beforebegin', stringifyStrBuffer(newChildBuf));

                    newChildBuf = null;
                    if (!nextChild) {
                        parentEl.removeChild(beforeEl);
                    }
                }
            }
        }
    }

    attachings.done();
}


exports = module.exports = createFor;
