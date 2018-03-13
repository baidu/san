/**
 * @file text 节点类
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
var NodeType = require('./node-type');
var getNodeStump = require('./get-node-stump');
var nodeEvalExpr = require('./node-eval-expr');
var warnSetHTML = require('./warn-set-html');
var isEndStump = require('./is-end-stump');
var isSimpleText = require('./is-simple-text');
var getNodePath = require('./get-node-path');


/**
 * text 节点类
 *
 * @param {Object} aNode 抽象节点
 * @param {Component} owner 所属组件环境
 * @param {Model=} scope 所属数据环境
 * @param {Node} parent 父亲节点
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function TextNode(aNode, owner, scope, parent, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;

    this._simple = isSimpleText(aNode);

    // #[begin] reverse
    if (reverseWalker) {
        var currentNode = reverseWalker.current;
        if (currentNode) {
            switch (currentNode.nodeType) {
                case 8:
                    if (currentNode.data === 's-text') {
                        currentNode.data = this.id;
                        reverseWalker.goNext();

                        while (1) { // eslint-disable-line
                            currentNode = reverseWalker.current;
                            if (!currentNode) {
                                throw new Error('[SAN REVERSE ERROR] Text end flag not found. \nPaths: '
                                    + getNodePath(this).join(' > '));
                            }

                            if (isEndStump(currentNode, 'text')) {
                                reverseWalker.goNext();
                                currentNode.data = this.id;
                                break;
                            }

                            reverseWalker.goNext();
                        }
                    }
                    break;

                case 3:
                    reverseWalker.goNext();
                    if (this._simple) {
                        this.el = currentNode;
                    }
                    break;
            }
        }
    }
    // #[end]
}

TextNode.prototype.nodeType = NodeType.TEXT;

/**
 * 将text attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
TextNode.prototype.attach = function (parentEl, beforeEl) {
    var buf = createHTMLBuffer();
    this._attachHTML(buf);
    outputHTMLBufferBefore(buf, parentEl, beforeEl);
};

/**
 * 销毁 text 节点
 */
TextNode.prototype.dispose = function () {
    this._prev = null;
    this.el = null;
};

/**
 * 获取文本节点对应的主元素
 *
 * @return {HTMLComment|HTMLTextNode}
 */
TextNode.prototype._getEl = function () {
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
},

/**
 * attach text 节点的 html
 *
 * @param {Object} buf html串存储对象
 */
TextNode.prototype._attachHTML = function (buf) {
    this.content = nodeEvalExpr(this, this.aNode.textExpr, 1);

    if (!this._simple) {
        htmlBufferComment(buf, this.id);
    }

    htmlBufferPush(buf, this.content);

    if (!this._simple) {
        htmlBufferComment(buf, this.id);
    }
};

var textUpdateProp;

/**
 * 更新 text 节点的视图
 *
 * @param {Array} changes 数据变化信息
 */
TextNode.prototype._update = function (changes) {
    if (this.aNode.textExpr.value) {
        return;
    }

    textUpdateProp = textUpdateProp
        || typeof document.createTextNode('').textContent === 'string' ? 'textContent' : 'data';

    var el = this._getEl();

    var len = changes ? changes.length : 0;
    while (len--) {
        if (changeExprCompare(changes[len].expr, this.aNode.textExpr, this.scope)) {
            var text = nodeEvalExpr(this, this.aNode.textExpr, 1);

            if (text !== this.content) {
                this.content = text;
                var rawText = nodeEvalExpr(this, this.aNode.textExpr);

                if (this._simple) {
                    el[textUpdateProp] = rawText;
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
};

exports = module.exports = TextNode;
