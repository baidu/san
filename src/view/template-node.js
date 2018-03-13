/**
 * @file template 节点类
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var guid = require('../util/guid');
var insertBefore = require('../browser/insert-before');
var htmlBufferComment = require('../runtime/html-buffer-comment');
var NodeType = require('./node-type');
var LifeCycle = require('./life-cycle');
var genElementChildrenHTML = require('./gen-element-children-html');
var nodeDispose = require('./node-dispose');
var createReverseNode = require('./create-reverse-node');
var elementDisposeChildren = require('./element-dispose-children');
var elementOwnToPhase = require('./element-own-to-phase');
var attachings = require('./attachings');
var isComponent = require('./is-component');
var elementUpdateChildren = require('./element-update-children');
var nodeCreateStump = require('./node-create-stump');
var nodeOwnSimpleAttached = require('./node-own-simple-attached');
var nodeOwnOnlyChildrenAttach = require('./node-own-only-children-attach');
var nodeOwnGetStumpEl = require('./node-own-get-stump-el');

/**
 * template 节点类
 *
 * @param {Object} aNode 抽象节点
 * @param {Component} owner 所属组件环境
 * @param {Model=} scope 所属数据环境
 * @param {Node} parent 父亲节点
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function TemplateNode(aNode, owner, scope, parent, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = isComponent(parent)
        ? parent
        : parent.parentComponent;

    this.id = guid();
    this.lifeCycle = LifeCycle.start;
    this.children = [];

    // #[begin] reverse
    if (reverseWalker) {
        this.sel = nodeCreateStump(this);
        insertBefore(this.sel, reverseWalker.target, reverseWalker.current);

        var me = this;
        each(this.aNode.children, function (aNodeChild) {
            me.children.push(createReverseNode(aNodeChild, reverseWalker, me));
        });

        this.el = nodeCreateStump(this);
        insertBefore(this.el, reverseWalker.target, reverseWalker.current);

        attachings.add(this);
    }
    // #[end]
}



TemplateNode.prototype.nodeType = NodeType.TPL;

TemplateNode.prototype.attach = nodeOwnOnlyChildrenAttach;

/**
 * 销毁释放
 *
 * @param {Object=} options dispose行为参数
 */
TemplateNode.prototype.dispose = function (options) {
    elementDisposeChildren(this, options);

    nodeDispose(this);
};


TemplateNode.prototype._toPhase = elementOwnToPhase;
TemplateNode.prototype._getEl = nodeOwnGetStumpEl;

/**
 * attach 元素的 html
 *
 * @param {Object} buf html串存储对象
 */
TemplateNode.prototype._attachHTML = function (buf) {
    htmlBufferComment(buf, this.id);
    genElementChildrenHTML(this, buf);
    htmlBufferComment(buf, this.id);

    attachings.add(this);
};

TemplateNode.prototype._attached = nodeOwnSimpleAttached;

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
TemplateNode.prototype._update = function (changes) {
    elementUpdateChildren(this, changes);
};

exports = module.exports = TemplateNode;
