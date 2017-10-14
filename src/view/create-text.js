/**
 * @file 创建 text 节点
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var removeEl = require('../browser/remove-el');
var createANode = require('../parser/create-a-node');
var ExprType = require('../parser/expr-type');
var pushStrBuffer = require('../runtime/push-str-buffer');
var changeExprCompare = require('../runtime/change-expr-compare');
var nodeInit = require('./node-init');
var NodeType = require('./node-type');
var nodeEvalExpr = require('./node-eval-expr');
var warnSetHTML = require('./warn-set-html');
var isEndStump = require('./is-end-stump');

/**
 * 创建 text 节点
 *
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 * @return {Object}
 */
function createText(options) {
    var node = nodeInit(options);
    node._type = NodeType.TEXT;

    node.dispose = textOwnDispose;
    node._attachHTML = textOwnAttachHTML;
    node._update = textOwnUpdate;

    // #[begin] reverse
    // from el
    if (node.el) {
        node.aNode = createANode({
            isText: 1,
            text: options.stumpText
        });

        node.parent._pushChildANode(node.aNode);

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

        removeEl(node.el);
        node.el = null;
    }
    // #[end]

    node._static = node.aNode.textExpr.value;

    return node;
}

/**
 * 销毁 text 节点
 */
function textOwnDispose() {
    this._prev = null;
    this.el = null;
    this.content = null;
}

/**
 * attach text 节点的 html
 *
 * @param {Object} buf html串存储对象
 */
function textOwnAttachHTML(buf) {
    this.content = nodeEvalExpr(this, this.aNode.textExpr, 1);
    pushStrBuffer(buf, this.content);
}


/* eslint-disable max-depth */

/**
 * 更新 text 节点的视图
 *
 * @param {Array} changes 数据变化信息
 */
function textOwnUpdate(changes) {
    var me = this;

    var len = changes ? changes.length : 0;
    while (len--) {
        if (changeExprCompare(changes[len].expr, this.aNode.textExpr, this.scope)) {
            var text = nodeEvalExpr(this, this.aNode.textExpr, 1);
            if (text !== this.content) {
                this.content = text;

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
                if (me.updateMode === 1) {
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
                }
                else {
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
                }
            }

            return;
        }
    }
}

/* eslint-enable max-depth */

exports = module.exports = createText;
