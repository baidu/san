/**
 * @file 创建 if 指令元素
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var empty = require('../util/empty');
var IndexedList = require('../util/indexed-list');
var parseTemplate = require('../parser/parse-template');
var createANode = require('../parser/create-a-node');
var removeEl = require('../browser/remove-el');
var genStumpHTML = require('./gen-stump-html');
var isEndStump = require('./is-end-stump');
var nodeInit = require('./node-init');
var NodeType = require('./node-type');
var nodeEvalExpr = require('./node-eval-expr');
var rinseCondANode = require('./rinse-cond-anode');
var createNode = require('./create-node');
var createReverseNode = require('./create-reverse-node');
var getNodeStumpParent = require('./get-node-stump-parent');
var elementUpdateChildren = require('./element-update-children');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');
var nodeOwnGetStumpEl = require('./node-own-get-stump-el');


/**
 * 创建 if 指令元素
 *
 * @param {Object} options 初始化参数
 * @return {Object}
 */
function createIf(options) {
    var node = nodeInit(options);
    node.children = [];
    node.nodeType = NodeType.IF;

    node.dispose = nodeOwnSimpleDispose;

    node._getEl = nodeOwnGetStumpEl;
    node._attachHTML = ifOwnAttachHTML;
    node._update = ifOwnUpdate;

    node.cond = node.aNode.directives.get('if').value;

    // #[begin] reverse
    var walker = options.reverseWalker;
    if (walker) {
        if (nodeEvalExpr(node, node.cond)) {
            node.elseIndex = -1;
            node.children[0] = createReverseNode(
                rinseCondANode(node.aNode),
                walker,
                node
            );
        }
        else {
            each(node.aNode.elses, function (elseANode, index) {
                var elif = elseANode.directives.get('elif');

                if (!elif || elif && nodeEvalExpr(node, elif.value)) {
                    node.elseIndex = index;
                    node.children[0] = createReverseNode(
                        rinseCondANode(elseANode),
                        walker,
                        node
                    );
                    return false;
                }
            });
        }
    }
    // #[end]



    return node;
}

/**
 * attach元素的html
 *
 * @param {Object} buf html串存储对象
 */
function ifOwnAttachHTML(buf) {
    var me = this;
    var elseIndex;
    var child;

    if (nodeEvalExpr(me, me.cond)) {
        child = createNode(rinseCondANode(me.aNode), me);
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.get('elif');

            if (!elif || elif && nodeEvalExpr(me, elif.value)) {
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

    genStumpHTML(this, buf);
}

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
function ifOwnUpdate(changes) {
    var me = this;
    var childANode = me.aNode;
    var elseIndex;

    if (nodeEvalExpr(this, this.cond)) {
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.get('elif');

            if (elif && nodeEvalExpr(me, elif.value) || !elif) {
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
}

exports = module.exports = createIf;
