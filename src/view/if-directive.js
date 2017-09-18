/**
 * @file if指令处理类
 * @author errorrik(errorrik@gmail.com)
 */

var empty = require('../util/empty');
var inherits = require('../util/inherits');
var IndexedList = require('../util/indexed-list');
var Element = require('./element');
var genStumpHTML = require('./gen-stump-html');
var createNode = require('./create-node');
var createNodeByEl = require('./create-node-by-el');
var parseTemplate = require('../parser/parse-template');
var createANode = require('../parser/create-a-node');
var ieOldThan9 = require('../browser/ie-old-than-9');
var removeEl = require('../browser/remove-el');
var escapeHTML = require('../runtime/escape-html');
var ExprType = require('../parser/expr-type');
var TextNode = require('./text-node');
var getNodeStump = require('./get-node-stump');
var getNodeStumpParent = require('./get-node-stump-parent');

/**
 * if 指令处理类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function IfDirective(options) {
    Element.call(this, options);
}

inherits(IfDirective, Element);

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
 * 创建元素DOM行为
 */
IfDirective.prototype._create = function () {
    if (!this.el) {
        this.el = document.createComment('san:' + this.id);
    }
};

/**
 * 初始化行为
 *
 * @param {Object} options 初始化参数
 */
IfDirective.prototype._init = function (options) {
    Node.prototype._init.call(this, options);

    // #[begin] reverse
    if (options.el) {
        if (options.el.nodeType === 8) {
            var aNode = parseTemplate(options.stumpText).childs[0];
            this.aNode = aNode;
        }
        else {
            this.elseIndex = -1;
            this.el = null;
            this._create();
            options.el.parentNode.insertBefore(this.el, options.el.nextSibling);

            options.el.removeAttribute('san-if');
            options.el.removeAttribute('s-if');

            var child = createNodeByEl(options.el, this, options.elWalker);
            this.childs[0] = child;
            this.aNode.childs = child.aNode.childs.slice(0);
        }

        this.parent._pushChildANode(this.aNode);
    }
    // #[end]

    this.cond = this.aNode.directives.get('if').value;
};

/**
 * 生成html
 *
 *
 * @param {StringBuffer} buf html串存储对象
 */
IfDirective.prototype.genHTML = function (buf) {
    var me = this;
    var elseIndex;
    var child;

    if (me.evalExpr(me.cond)) {
        child = createIfDirectiveChild(me.aNode, me);
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.get('elif');

            if (!elif || elif && me.evalExpr(elif.value)) {
                child = createIfDirectiveChild(elseANode, me);
                elseIndex = index;
                return false;
            }
        });
    }

    if (child) {
        me.childs[0] = child;
        child.genHTML(buf);
        me.elseIndex = elseIndex;
    }

    genStumpHTML(this, buf);
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
IfDirective.prototype.updateView = function (changes) {
    var me = this;
    var childANode = me.aNode;
    var elseIndex;

    if (this.evalExpr(this.cond)) {
        elseIndex = -1;
    }
    else {
        each(me.aNode.elses, function (elseANode, index) {
            var elif = elseANode.directives.get('elif');

            if (elif && me.evalExpr(elif.value) || !elif) {
                elseIndex = index;
                childANode = elseANode;
                return false;
            }
        });
    }

    if (elseIndex === me.elseIndex) {
        me.updateChilds(changes);
    }
    else {
        me._disposeChilds();

        if (typeof elseIndex !== 'undefined') {
            var child = createIfDirectiveChild(childANode, me);
            var parentEl = getNodeStumpParent(me);
            child.attach(parentEl, me._getEl() || parentEl.firstChild);

            me.childs[0] = child;
        }

        me.elseIndex = elseIndex;
    }
};


/**
 * 获取节点对应的主元素
 *
 * @protected
 * @return {HTMLElement}
 */
IfDirective.prototype._getEl = function () {
    return getNodeStump(this);
};

// #[begin] reverse
/**
 * 清空添加子节点的 ANode 的行为
 * 从 el 初始化时，不接受子节点的 ANode信息
 */
IfDirective.prototype._pushChildANode = empty;
// #[end]



exports = module.exports = IfDirective;
