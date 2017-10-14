/**
 * @file 创建 if 指令元素
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var empty = require('../util/empty');
var IndexedList = require('../util/indexed-list');
var parseTemplate = require('../parser/parse-template');
var createANode = require('../parser/create-a-node');
var genStumpHTML = require('./gen-stump-html');
var nodeInit = require('./node-init');
var NodeType = require('./node-type');
var nodeEvalExpr = require('./node-eval-expr');
var createNode = require('./create-node');
var createNodeByEl = require('./create-node-by-el');
var getNodeStumpParent = require('./get-node-stump-parent');
var elementUpdateChilds = require('./element-update-childs');
var elementDisposeChilds = require('./element-dispose-childs');
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
    node.childs = [];
    node._type = NodeType.IF;

    node.dispose = nodeOwnSimpleDispose;

    node._getEl = nodeOwnGetStumpEl;
    node._attachHTML = ifOwnAttachHTML;
    node._update = ifOwnUpdate;

    // #[begin] reverse
    node._pushChildANode = empty;
    // #[end]

    // #[begin] reverse
    if (options.el) {
        if (options.el.nodeType === 8) {
            var aNode = parseTemplate(options.stumpText).childs[0];
            node.aNode = aNode;
        }
        else {
            node.elseIndex = -1;
            var el = document.createComment('san:' + this.id);
            options.el.parentNode.insertBefore(el, options.el.nextSibling);


            options.el.removeAttribute('san-if');
            options.el.removeAttribute('s-if');

            var child = createNodeByEl(options.el, node, options.elWalker);
            node.childs[0] = child;
            node.aNode.childs = child.aNode.childs.slice(0);

            node.el = el;
        }

        node.parent._pushChildANode(node.aNode);
    }
    // #[end]

    node.cond = node.aNode.directives.get('if').value;

    return node;
}

/**
 * 创建 if 指令对应条件为 true 时对应的元素
 *
 * @inner
 * @param {ANode} directiveANode 指令ANode
 * @param {IfDirective} mainIf 主if元素
 * @return {Element}
 */
function createIfDirectiveChild(directiveANode, mainIf) {
    var childANode = createANode({
        childs: directiveANode.childs,
        props: directiveANode.props,
        events: directiveANode.events,
        tagName: directiveANode.tagName,
        directives: (new IndexedList()).concat(directiveANode.directives)
    });

    childANode.directives.remove('if');
    childANode.directives.remove('else');
    childANode.directives.remove('elif');

    return createNode(childANode, mainIf);
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
        child = createIfDirectiveChild(me.aNode, me);
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.get('elif');

            if (!elif || elif && nodeEvalExpr(me, elif.value)) {
                child = createIfDirectiveChild(elseANode, me);
                elseIndex = index;
                return false;
            }
        });
    }

    if (child) {
        me.childs[0] = child;
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
        elementUpdateChilds(me, changes);
    }
    else {
        elementDisposeChilds(me);

        if (typeof elseIndex !== 'undefined') {
            var child = createIfDirectiveChild(childANode, me);
            var parentEl = getNodeStumpParent(me);
            child.attach(parentEl, me._getEl() || parentEl.firstChild);

            me.childs[0] = child;
        }

        me.elseIndex = elseIndex;
    }
}

exports = module.exports = createIf;
