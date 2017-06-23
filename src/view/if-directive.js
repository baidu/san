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
var isStump = require('./is-stump');
var ExprType = require('../parser/expr-type');
var TextNode = require('./text-node');

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
 * @param {IfDirective} ifElement if指令元素
 * @return {Element}
 */
function createIfDirectiveChild(ifElement) {
    var aNode = ifElement.aNode;
    var childANode = createANode({
        childs: aNode.childs,
        props: aNode.props,
        events: aNode.events,
        tagName: aNode.tagName,
        directives: (new IndexedList()).concat(aNode.directives)
    });

    childANode.directives.remove('if');
    childANode.directives.remove('else');

    return createNode(childANode, ifElement);
}

/**
 * 创建元素DOM行为
 */
IfDirective.prototype._create = function () {
    if (!this.el) {
        this.el = document.createElement('script');
        this.el.type = 'text/san';
        this.el.id = this.id;
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
        if (isStump(options.el)) {
            var aNode = parseTemplate(options.el.innerHTML).childs[0];
            this.aNode = aNode;
        }
        else {
            this.el = null;
            this._create();
            options.el.parentNode.insertBefore(this.el, options.el.nextSibling);

            options.el.removeAttribute('san-if');
            options.el.removeAttribute('san-else');
            options.el.removeAttribute('s-if');
            options.el.removeAttribute('s-else');

            var child = createNodeByEl(options.el, this, options.elWalker);
            this.childs[0] = child;
            this.aNode.childs = child.aNode.childs.slice(0);
        }

        // match if directive for else directive
        var elseDirective = this.aNode.directives.get('else');
        if (elseDirective) {
            var parentChilds = this.parent.childs;
            var len = parentChilds.length;

            while (len--) {
                var child = parentChilds[len];

                if (child instanceof TextNode) {
                    continue;
                }

                if (child instanceof IfDirective) {
                    elseDirective.value = {
                        type: ExprType.UNARY,
                        expr: child.aNode.directives.get('if').value
                    };

                    break;
                }

                throw new Error('[SAN FATEL] else not match if.');
            }
        }

        this.parent._pushChildANode(this.aNode);
    }
    // #[end]

    this.cond = (this.aNode.directives.get('else') || this.aNode.directives.get('if')).value;
};

/**
 * 生成html
 *
 *
 * @param {StringBuffer} buf html串存储对象
 */
IfDirective.prototype.genHTML = function (buf) {
    if (this.evalExpr(this.cond)) {
        var child = createIfDirectiveChild(this);
        this.childs[0] = child;
        child.genHTML(buf);
    }
    else if (ieOldThan9) {
        buf.push('\uFEFF');
    }

    genStumpHTML(this, buf);
};

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
IfDirective.prototype.updateView = function (changes) {
    var child = this.childs[0];
    var el = this._getEl();

    if (this.evalExpr(this.cond)) {
        if (child) {
            this.updateChilds(changes);
        }
        else {
            child = createIfDirectiveChild(this);
            child.attach(el.parentNode, el);
            this.childs[0] = child;
        }
    }
    else {
        this._disposeChilds();
    }
};

// #[begin] reverse
/**
 * 清空添加子节点的 ANode 的行为
 * 从 el 初始化时，不接受子节点的 ANode信息
 */
IfDirective.prototype._pushChildANode = empty;
// #[end]

IfDirective.prototype._attached = function () {
    // 移除节点桩元素前面的空白 FEFF 字符
    if (ieOldThan9 && this._getEl()) {
        var headingBlank = this._getEl().previousSibling;

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


exports = module.exports = IfDirective;
