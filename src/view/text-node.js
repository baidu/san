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
var serializeStump = require('./serialize-stump');

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
            text: this.el.innerHTML
        });

        this.parent._pushChildANode(this.aNode);
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
    buf.push(this.evalExpr(this.aNode.textExpr, 1) || (ieOldThan9 ? '\uFEFF' : ''));

    if (!this._static) {
        genStumpHTML(this, buf);
    }
};

/**
 * 刷新文本节点的内容
 */
TextNode.prototype.update = function () {
    var el = this._getEl();
    var node = el.previousSibling;

    if (node && node.nodeType === 3) {
        var textProp = typeof node.textContent === 'string'
            ? 'textContent'
            : 'data';
        node[textProp] = this.evalExpr(this.aNode.textExpr);
    }
    else {
        el.insertAdjacentHTML(
            'beforebegin',
            this.evalExpr(this.aNode.textExpr, 1)
        );
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

// #[begin] ssr
/**
 * 序列化文本节点，用于服务端生成在浏览器端可被反解的html串
 *
 * @return {string}
 */
TextNode.prototype.serialize = function () {
    var str = this.evalExpr(this.aNode.textExpr, 1);

    if (!this._static) {
        str += serializeStump('text', this.aNode.text);
    }

    return str;
};
// #[end]

exports = module.exports = TextNode;
