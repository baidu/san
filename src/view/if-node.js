/**
 * @file if 指令节点类
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var guid = require('../util/guid');
var htmlBufferComment = require('../runtime/html-buffer-comment');
var evalExpr = require('../runtime/eval-expr');
var NodeType = require('./node-type');
var rinseCondANode = require('./rinse-cond-anode');
var isComponent = require('./is-component');
var createNode = require('./create-node');
var createReverseNode = require('./create-reverse-node');
var getNodeStumpParent = require('./get-node-stump-parent');
var elementUpdateChildren = require('./element-update-children');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');
var nodeOwnGetStumpEl = require('./node-own-get-stump-el');

/**
 * if 指令节点类
 *
 * @param {Object} aNode 抽象节点
 * @param {Component} owner 所属组件环境
 * @param {Model=} scope 所属数据环境
 * @param {Node} parent 父亲节点
 * @param {DOMChildrenWalker?} reverseWalker 子元素遍历对象
 */
function IfNode(aNode, owner, scope, parent, reverseWalker) {
    this.aNode = aNode;
    this.owner = owner;
    this.scope = scope;
    this.parent = parent;
    this.parentComponent = isComponent(parent)
        ? parent
        : parent.parentComponent;

    this.id = guid();
    this.children = [];

    this.cond = this.aNode.directives['if'].value; // eslint-disable-line dot-notation

    // #[begin] reverse
    if (reverseWalker) {
        if (evalExpr(this.cond, this.scope, this.owner)) {
            this.elseIndex = -1;
            this.children[0] = createReverseNode(
                rinseCondANode(aNode),
                reverseWalker,
                this
            );
        }
        else {
            var me = this;
            each(aNode.elses, function (elseANode, index) {
                var elif = elseANode.directives.elif;

                if (!elif || elif && evalExpr(elif.value, me.scope, me.owner)) {
                    me.elseIndex = index;
                    me.children[0] = createReverseNode(
                        rinseCondANode(elseANode),
                        reverseWalker,
                        me
                    );
                    return false;
                }
            });
        }
    }
    // #[end]
}

IfNode.prototype.nodeType = NodeType.IF;
IfNode.prototype._getEl = nodeOwnGetStumpEl;
IfNode.prototype.dispose = nodeOwnSimpleDispose;


/**
 * attach元素的html
 *
 * @param {Object} buf html串存储对象
 */
IfNode.prototype._attachHTML = function (buf) {
    var me = this;
    var elseIndex;
    var child;

    if (evalExpr(this.cond, this.scope, this.owner)) {
        child = createNode(rinseCondANode(me.aNode), me);
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.elif;

            if (!elif || elif && evalExpr(elif.value, me.scope, me.owner)) {
                child = createNode(rinseCondANode(elseANode), me);
                elseIndex = index;
                return false;
            }
        });
    }

    if (child) {
        me.children[0] = child;
        child._attachHTML(buf);
        me.elseIndex = elseIndex;
    }

    htmlBufferComment(buf, this.id);
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
IfNode.prototype._update = function (changes) {
    var me = this;
    var childANode = me.aNode;
    var elseIndex;

    if (evalExpr(this.cond, this.scope, this.owner)) {
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.elif;

            if (elif && evalExpr(elif.value, me.scope, me.owner) || !elif) {
                elseIndex = index;
                childANode = elseANode;
                return false;
            }
        });
    }

    if (elseIndex === me.elseIndex) {
        elementUpdateChildren(me, changes);
    }
    else {
        var child = me.children[0];
        me.children.length = 0;
        if (child) {
            child._ondisposed = newChild;
            child.dispose();
        }
        else {
            newChild();
        }

        me.elseIndex = elseIndex;
    }

    function newChild() {
        if (typeof elseIndex !== 'undefined') {
            var child = createNode(rinseCondANode(childANode), me);
            var parentEl = getNodeStumpParent(me);
            child.attach(parentEl, me._getEl() || parentEl.firstChild);

            me.children[0] = child;
        }
    }
};

exports = module.exports = IfNode;
