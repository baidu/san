/**
 * @file 创建 text 节点
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var removeEl = require('../browser/remove-el');
var insertBefore = require('../browser/insert-before');
var createHTMLBuffer = require('../runtime/create-html-buffer');
var htmlBufferPush = require('../runtime/html-buffer-push');
var htmlBufferComment = require('../runtime/html-buffer-comment');
var outputHTMLBufferBefore = require('../runtime/output-html-buffer-before');
var changeExprCompare = require('../runtime/change-expr-compare');
var nodeInit = require('./node-init');
var NodeType = require('./node-type');
var getNodeStump = require('./get-node-stump');
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
    node._getEl = textOwnGetEl;
    node._attachHTML = textOwnAttachHTML;
    node._update = textOwnUpdate;

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
                        currentNode.data = node.id;
                        walker.goNext();

                        while (1) { // eslint-disable-line
                            currentNode = walker.current;
                            if (!currentNode) {
                                throw new Error('[SAN REVERSE ERROR] Text end flag not found. \nPaths: '
                                    + getNodePath(node).join(' > '));
                            }

                            if (isEndStump(currentNode, 'text')) {
                                walker.goNext();
                                currentNode.data = node.id;
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
 * 获取文本节点对应的主元素
 *
 * @return {HTMLComment|HTMLTextNode}
 */
function textOwnGetEl() {
    if (this.el) {
        return this.el;
    }

    if (this._simple) {
        var parent = this.parent;
        var prev;

        var me = this;
        each(parent.children, function (child, i) {
            if (child === me) {
                return false;
            }

            prev = child;
        });

        var parentEl = parent._getEl();
        if (parentEl.nodeType !== 1) {
            parentEl = parentEl.parentNode;
        }

        var prevEl = prev && prev._getEl() && prev.el.nextSibling;
        if (!prevEl) {
            switch (parent.nodeType) {
                case NodeType.TPL:
                case NodeType.SLOT:
                    prevEl = parent.sel.nextSibling;
                    break;
                default:
                    prevEl = parentEl.firstChild;
            }
        }


        if (this.content) {
            this.el = prevEl;
        }
        else {
            this.el = document.createTextNode('');
            insertBefore(this.el, parentEl, prevEl);
        }
    }

    return getNodeStump(this);
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
function textOwnAttachHTML(buf) {debugger
    this.content = nodeEvalExpr(this, this.aNode.textExpr, 1);

    if (!this._simple) {
        htmlBufferComment(buf, this.id);
    }

    htmlBufferPush(buf, this.content);

    if (!this._simple) {
        htmlBufferComment(buf, this.id);
    }
}

/**
 * 将text attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function textOwnAttach(parentEl, beforeEl) {
    var buf = createHTMLBuffer();
    this._attachHTML(buf);
    outputHTMLBufferBefore(buf, parentEl, beforeEl);
}

/* eslint-disable max-depth */

/**
 * 更新 text 节点的视图
 *
 * @param {Array} changes 数据变化信息
 */
function textOwnUpdate(changes) {
    if (this.aNode.textExpr.value) {
        return;
    }

    var el = this._getEl();

    var len = changes ? changes.length : 0;
    while (len--) {
        if (changeExprCompare(changes[len].expr, this.aNode.textExpr, this.scope)) {
            var text = nodeEvalExpr(this, this.aNode.textExpr, 1);

            if (text !== this.content) {
                this.content = text;
                var rawText = nodeEvalExpr(this, this.aNode.textExpr);

                if (this._simple) {
                    el[typeof el.textContent === 'string' ? 'textContent' : 'data'] = rawText;
                }
                else {
                    var startRemoveEl = this.sel.nextSibling;
                    var parentEl = el.parentNode;

                    while (startRemoveEl !== el) {
                        var removeTarget = startRemoveEl;
                        startRemoveEl = startRemoveEl.nextSibling;
                        removeEl(removeTarget);
                    }

                    // #[begin] error
                    warnSetHTML(parentEl);
                    // #[end]

                    var tempFlag = document.createElement('script');
                    parentEl.insertBefore(tempFlag, el);
                    tempFlag.insertAdjacentHTML('beforebegin', text);
                    parentEl.removeChild(tempFlag);
                }
            }

            return;
        }
    }
}

/* eslint-enable max-depth */

exports = module.exports = createText;
