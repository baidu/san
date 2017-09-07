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
var Element = require('./element');
var genStumpHTML = require('./gen-stump-html');
var createNode = require('./create-node');
var createNodeByEl = require('./create-node-by-el');
var getNodeStump = require('./get-node-stump');
var isEndStump = require('./is-end-stump');
var getNodeStumpParent = require('./get-node-stump-parent');
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
 * @class
 * @param {Object} options 初始化参数
 */
function ForDirective(options) {
    Element.call(this, options);
}

inherits(ForDirective, Element);

// #[begin] reverse
/**
 * 清空添加子节点的 ANode 的行为
 * 从 el 初始化时，不接受子节点的 ANode信息
 */
ForDirective.prototype._pushChildANode = empty;
// #[end]

/**
 * 生成html
 *
 * @param {StringBuffer} buf html串存储对象
 * @param {boolean} onlyChilds 是否只生成列表本身html，不生成stump部分
 */
ForDirective.prototype.genHTML = function (buf, onlyChilds) {
    each(
        this.evalExpr(this.aNode.directives.get('for').list),
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
};

/**
 * 初始化行为
 *
 * @param {Object} options 初始化参数
 */
ForDirective.prototype._init = function (options) {
    Node.prototype._init.call(this, options);

    var aNode = this.aNode;

    // #[begin] reverse
    if (options.el) {
        aNode = parseTemplate(options.stumpText).childs[0];
        this.aNode = aNode;

        var index = 0;
        var directive = aNode.directives.get('for');
        var listData = this.evalExpr(directive.list) || [];

        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (isEndStump(next, 'for')) {
                removeEl(options.el);
                this.el = next;
                options.elWalker.goNext();
                break;
            }

            var itemScope = new ForItemData(this.scope, directive, listData[index], index);
            var child = createNodeByEl(next, this, options.elWalker, itemScope);
            this.childs.push(child);

            index++;
            options.elWalker.goNext();
        }

        this.parent._pushChildANode(this.aNode);
    }
    // #[end]

    this.itemANode = createANode({
        childs: aNode.childs,
        props: aNode.props,
        events: aNode.events,
        tagName: aNode.tagName,
        directives: (new IndexedList()).concat(aNode.directives)
    });
    this.itemANode.directives.remove('for');
};


/**
 * 将元素attach到页面的行为
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
ForDirective.prototype._attach = function (parentEl, beforeEl) {
    this.create();
    if (parentEl) {
        if (beforeEl) {
            parentEl.insertBefore(this.el, beforeEl);
        }
        else {
            parentEl.appendChild(this.el);
        }
    }

    this._paintList();
};

/**
 * 绘制整个列表。用于被 attach，或整个列表数据被重置时的刷新
 *
 * @private
 */
ForDirective.prototype._paintList = function () {
    var parentEl = getNodeStumpParent(this);
    var el = this._getEl() || parentEl.firstChild;
    var prevEl = el && el.previousSibling;
    var buf = new StringBuffer();

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
            this.evalExpr(this.aNode.directives.get('for').list),
            function (item, i) {
                var child = createForDirectiveChild(this, item, i);
                this.childs.push(child);
                child.attach(parentEl, el);
            },
            this
        );
    }
}

/**
 * 将元素从页面上移除的行为
 */
ForDirective.prototype._detach = function () {
    this._disposeChilds();
    removeEl(this._getEl());
};

/**
 * 创建元素DOM行为
 */
ForDirective.prototype._create = function () {
    if (!this.el) {
        this.el = document.createComment('san:' + this.id);
    }
};


/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
ForDirective.prototype.updateView = function (changes) {
    var childsChanges = [];
    each(this.childs, function () {
        childsChanges.push([]);
    });

    var repaintAll = 0;
    var forDirective = this.aNode.directives.get('for');
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

            var changeIndex = +this.evalExpr(changePaths[forLen]);
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
            this._disposeChilds();
            repaintAll = 1;
        }
        else if (relation === 2 && change.type === DataChangeType.SPLICE) {
            // 变更表达式是list绑定表达式本身数组的SPLICE操作
            // 此时需要删除部分项，创建部分项
            var changeStart = change.index;
            var deleteCount = change.deleteCount;

            var lengthChange = {
                type: DataChangeType.SET,
                option: change.option,
                expr: {
                    type: ExprType.ACCESSOR,
                    paths: change.expr.paths.concat({
                        type: ExprType.STRING,
                        value: 'length'
                    })
                }
            };
            var indexChange = {
                type: DataChangeType.SET,
                option: change.option,
                expr: forDirective.index
            };

            var insertionsLen = change.insertions.length;
            each(this.childs, function (child, index) {
                childsChanges[index].push(lengthChange);

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

            var spliceArgs = [changeStart, deleteCount];
            var childsChangesSpliceArgs = [changeStart, deleteCount];
            each(change.insertions, function (insertion, index) {
                spliceArgs.push(createForDirectiveChild(this, insertion, changeStart + index));
                childsChangesSpliceArgs.push([]);
            }, this);

            each(this.childs.splice.apply(this.childs, spliceArgs), function (child) {
                child.dispose();
            });
            childsChanges.splice.apply(childsChanges, childsChangesSpliceArgs);
        }

        return !repaintAll;
    }, this);


    if (repaintAll) {
        // 整个列表都需要重新刷新
        this._paintList();
        this._toAttached();
    }
    else {
        // 对相应的项进行更新
        // 如果不存在则直接创建，如果存在则调用更新函数
        var len = this.childs.length;
        var attachStump = this;

        while (len--) {
            var child = this.childs[len];
            if (child.lifeCycle.is('attached')) {
                childsChanges[len].length && child.updateView(childsChanges[len]);
            }
            else {
                child.attach(getNodeStumpParent(attachStump), attachStump._getEl());
            }

            attachStump = child;
        }
    }
};

/**
 * 获取节点对应的主元素
 *
 * @protected
 * @return {HTMLElement}
 */
ForDirective.prototype._getEl = function () {
    return getNodeStump(this);
};


exports = module.exports = ForDirective;
