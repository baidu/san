/**
 * @file 文本节点类
 * @author errorrik(errorrik@gmail.com)
 */


var inherits = require('../util/inherits');
var each = require('../util/each');
var Node = require('./node');
var genStumpHTML = require('./gen-stump-html');
var ANode = require('../parser/a-node');
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
        this.aNode = new ANode({
            isText: 1,
            text: this.el.data.replace('[san:ts]', '')
        });

        this.parent._pushChildANode(this.aNode);

        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (next.nodeType === 8 && next.data === '[san:te]') {
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
    buf.push(this.evalExpr(this.aNode.textExpr, 1));
};

/**
 * 刷新文本节点的内容
 */
TextNode.prototype.update = function () {
    if (!this._located) {
        var index = -1;
        var me = this;
        each(this.parent.childs, function (child, i) {
            if (child === me) {
                index = i;
                return false;
            }
        });

        this._prev = this.parent.childs[index - 1];
        this._located = 1;
    }

    var text = this.evalExpr(this.aNode.textExpr, 1);

    var parentEl = this.parent._getEl();
    var insertBeforeEl = this._prev && this._prev._getEl().nextSibling || parentEl.firstChild;
    var startRemoveEl = insertBeforeEl;

    while (startRemoveEl && !/^_san_/.test(startRemoveEl.id)) {
        insertBeforeEl = startRemoveEl.nextSibling;
        removeEl(startRemoveEl);
        startRemoveEl = insertBeforeEl;
    }

    if (insertBeforeEl) {
        insertBeforeEl.insertAdjacentHTML('beforebegin', text);
    }
    else {
        parentEl.innerHTML = text;
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

TextNode.prototype._attached = function () {
    // 移除节点桩元素前面的空白 FEFF 字符
    if (ieOldThan9 && this._getEl()) {
        var headingBlank = this.el.previousSibling;

        if (headingBlank && headingBlank.nodeType === 3) {
            var textProp = typeof headingBlank.textContent === 'string'
                ? 'textContent'
                : 'data';
            var text = headingBlank[textProp];

            if (!text || text === '\uFEFF') {
                removeEl(headingBlank);
            }
        }
    }
};

exports = module.exports = TextNode;
