/**
 * @file 文本节点类
 * @author errorrik(errorrik@gmail.com)
 */


var inherits = require('../util/inherits');
var each = require('../util/each');
var Node = require('./node');
var isEndStump = require('./is-end-stump');
var warnSetHTML = require('./warn-set-html');
var createANode = require('../parser/create-a-node');
var changeExprCompare = require('../runtime/change-expr-compare');
var removeEl = require('../browser/remove-el');
var ieOldThan9 = require('../browser/ie-old-than-9');

/**
 * 文本节点类
 *
 * @class
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component} options.owner 所属的组件对象
 */
function TextNode(options) {
    Node.call(this, options);
}

inherits(TextNode, Node);

/**
 * 初始化行为
 *
 * @param {Object} options 初始化参数
 */
TextNode.prototype._init = function (options) {
    Node.prototype._init.call(this, options);

    // #[begin] reverse
    // from el
    if (this.el) {
        this.aNode = createANode({
            isText: 1,
            text: options.stumpText
        });

        this.parent._pushChildANode(this.aNode);

        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (isEndStump(next, 'text')) {
                options.elWalker.goNext();
                removeEl(next);
                break;
            }

            options.elWalker.goNext();
        }

        removeEl(this.el);
        this.el = null;
    }
    // #[end]

    this._static = this.aNode.textExpr.value;
};

/**
 * 生成文本节点的HTML
 *
 * @param {StringBuffer} buf html串存储对象
 */
TextNode.prototype.genHTML = function (buf) {
    this.content = this.evalExpr(this.aNode.textExpr, 1);
    buf.push(this.content);
};

/**
 * 刷新文本节点的内容
 */
TextNode.prototype.update = function () {
    // 根据 text value 判断是否需要更新
    var text = this.evalExpr(this.aNode.textExpr, 1);
    if (text === this.content) {
        return;
    }
    this.content = text;


    var me = this;

    // 无 stump 元素，所以需要根据组件结构定位
    if (!this._located) {
        each(this.parent.childs, function (child, i) {
            if (child === me) {
                me._prev = me.parent.childs[i - 1];
                return false;
            }
        });

        this._located = 1;
    }

    // 两种 update 模式
    // 1. 单纯的 text node
    // 2. 可能是复杂的 html 结构
    if (!me.updateMode) {
        me.updateMode = 1;
        each(this.aNode.textExpr.segs, function (seg) {
            if (seg.type === ExprType.INTERP) {
                each(seg.filters, function (filter) {
                    switch (filter.name) {
                        case 'html':
                        case 'url':
                            return;
                    }

                    me.updateMode = 2;
                    return false;
                });
            }

            return me.updateMode < 2;
        });
    }

    var parentEl = this.parent._getEl();
    switch (me.updateMode) {
        case 1:
            if (me.el) {
                me.el[typeof me.el.textContent === 'string' ? 'textContent' : 'data'] = text;
            }
            else {
                var el = me._prev && me._prev._getEl().nextSibling || parentEl.firstChild;
                if (el) {
                    switch (el.nodeType) {
                        case 3:
                            me.el = el;
                            me.el[typeof me.el.textContent === 'string' ? 'textContent' : 'data'] = text;
                            break;
                        case 1:
                            el.insertAdjacentHTML('beforebegin', text);
                            break;
                        default:
                            me.el = document.createTextNode(text);
                            parentEl.insertBefore(me.el, el);
                    }
                }
                else {
                    parentEl.insertAdjacentHTML('beforeend', text);
                }
            }

            break;

        case 2:
            var insertBeforeEl = me._prev && me._prev._getEl().nextSibling || parentEl.firstChild;
            var startRemoveEl = insertBeforeEl;
        
            while (startRemoveEl && !/^_san_/.test(startRemoveEl.id)) {
                insertBeforeEl = startRemoveEl.nextSibling;
                removeEl(startRemoveEl);
                startRemoveEl = insertBeforeEl;
            }
        
            // #[begin] error
            warnSetHTML(parentEl);
            // #[end]
            
            
            if (insertBeforeEl) {
                insertBeforeEl.insertAdjacentHTML('beforebegin', text);
            }
            else if (me._prev) {
                me._prev._getEl().insertAdjacentHTML('afterend', text);
            }
            else {
                parentEl.innerHTML = text;
            }

            break;


    }
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
TextNode.prototype.updateView = function (changes) {
    var me = this;

    each(changes, function (change) {
        if (changeExprCompare(change.expr, me.aNode.textExpr, me.scope)) {
            me.update();
            return false;
        }
    });
};


exports = module.exports = TextNode;
