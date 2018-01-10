/**
 * @file 创建 text 节点
 * @author errorrik(errorrik@gmail.com)
 */

var removeEl = require('../browser/remove-el');
var insertHTMLBefore = require('../browser/insert-html-before');
var pushStrBuffer = require('../runtime/push-str-buffer');
var changeExprCompare = require('../runtime/change-expr-compare');
var nodeInit = require('./node-init');
var NodeType = require('./node-type');
var nodeEvalExpr = require('./node-eval-expr');
var warnSetHTML = require('./warn-set-html');
var isEndStump = require('./is-end-stump');
var isSimpleText = require('./is-simple-text');
var getNodePath = require('./get-node-path');

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
    node.nodeType = NodeType.TEXT;

    node.attach = textOwnAttach;
    node.dispose = textOwnDispose;
    node._attachHTML = textOwnAttachHTML;
    node._update = textOwnUpdate;

    node._static = node.aNode.textExpr.value;
    node._simple = isSimpleText(node.aNode);

    // #[begin] reverse
    var walker = options.reverseWalker;
    if (walker) {
        options.reverseWalker = null;

        var currentNode = walker.current;
        if (currentNode) {
            switch (currentNode.nodeType) {
                case 8:
                    if (currentNode.data === 's-text') {
                        removeEl(currentNode);
                        walker.goNext();

                        while (1) { // eslint-disable-line
                            currentNode = walker.current;
                            if (!currentNode) {
                                throw new Error('[SAN REVERSE ERROR] Text end flag not found. \nPaths: '
                                    + getNodePath(node).join(' > '));
                            }

                            if (isEndStump(currentNode, 'text')) {
                                walker.goNext();
                                removeEl(currentNode);
                                break;
                            }

                            walker.goNext();
                        }
                    }
                    break;

                case 3:
                    walker.goNext();
                    if (node._simple) {
                        node.el = currentNode;
                    }
                    break;
            }
        }
    }
    // #[end]

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

/**
 * 定位text节点在父元素中的位置
 *
 * @param {Object} node text节点元素
 */
function textLocatePrevNode(node) {
    function getPrev(node) {
        var parentChildren = node.parent.children;
        var len = parentChildren.length;

        while (len--) {
            if (node === parentChildren[len]) {
                return parentChildren[len - 1];
            }
        }
    }

    if (!node._located) {
        var parentBase = node.parent;
        node._prev = getPrev(node);
        while (!node._prev && parentBase
            && (parentBase.nodeType === NodeType.TPL
                || parentBase.nodeType === NodeType.SLOT)
        ) {
            node._prev = getPrev(parentBase);
            parentBase = parentBase.parent;
        }

        node._located = 1;
    }
}

/**
 * 将text attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function textOwnAttach(parentEl, beforeEl) {
    this.content = nodeEvalExpr(this, this.aNode.textExpr, 1);

    insertHTMLBefore(this.content, parentEl, beforeEl);
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
                var rawText = nodeEvalExpr(this, this.aNode.textExpr);

                // 无 stump 元素，所以需要根据组件结构定位
                textLocatePrevNode(me);

                var parentEl = this.parent._getEl();
                if (me._simple) {
                    if (me.el) {
                        me.el[typeof me.el.textContent === 'string' ? 'textContent' : 'data'] = rawText;
                    }
                    else {
                        var prevEl = me._prev && me._prev._getEl();
                        prevEl = prevEl && prevEl.nextSibling;
                        var el = prevEl || parentEl.firstChild;
                        if (el) {
                            switch (el.nodeType) {
                                case 3:
                                    me.el = el;
                                    me.el[typeof me.el.textContent === 'string' ? 'textContent' : 'data'] = rawText;
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

                    insertHTMLBefore(text, parentEl, insertBeforeEl);
                }
            }

            return;
        }
    }
}

/* eslint-enable max-depth */

exports = module.exports = createText;
