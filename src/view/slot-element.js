/**
 * @file slot元素类
 * @author errorrik(errorrik@gmail.com)
 */

var inherits = require('../util/inherits');
var each = require('../util/each');
var empty = require('../util/empty');
var Node = require('./node');
var Element = require('./element');
var isComponent = require('./is-component');
var Component = require('./component');
var createANode = require('../parser/create-a-node');
var serializeStump = require('./serialize-stump');
var genElementChildsHTML = require('./gen-element-childs-html');


/**
 * slot 元素类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function SlotElement(options) {
    this.childs = [];
    Node.call(this, options);
}

inherits(SlotElement, Node);

/**
 * 初始化行为
 *
 * @param {Object} options 初始化参数
 */
SlotElement.prototype._init = function (options) {
    var literalOwner = options.owner;
    var nameBind = options.aNode.props.get('name');
    this.name = nameBind ? nameBind.raw : '____';
    var aNode = createANode();

    // #[begin] reverse
    if (options.el) {
        this.name = options.el.getAttribute('name') || '____';
        if (!options.el.getAttribute('by-default')) {
            options.owner = literalOwner.owner;
            options.scope = literalOwner.scope;
        }
    }
    else {
    // #[end]
        var givenSlots = literalOwner.aNode.givenSlots;
        var givenChilds = givenSlots && givenSlots[this.name];
        aNode.childs = givenChilds || options.aNode.childs.slice(0);

        if (givenChilds) {
            options.owner = literalOwner.owner;
            options.scope = literalOwner.scope;
        }
    // #[begin] reverse
    }
    // #[end]


    options.aNode = aNode;
    Node.prototype._init.call(this, options);

    var parent = this.parent;
    while (parent) {
        if (parent === this.owner) {
            parent.ownSlotChilds.push(this);
            break;
        }

        if (!(parent instanceof SlotElement) && parent.owner === this.owner) {
            parent.slotChilds.push(this);
            break;
        }

        parent = parent.parent;
    }

    // #[begin] reverse
    if (options.el) {
        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (!next || next.getAttribute('s-stump') === 'slot-end') {
                next && options.elWalker.goNext();
                break;
            }

            var child = createNodeByEl(next, this, options.elWalker);
            this.childs.push(child);
            options.elWalker.goNext();
        }

        if (literalOwner !== this.owner) {
            literalOwner.aNode.givenSlots[this.name] = this.aNode;
        }
    }
    // #[end]
};

/**
 * 生成元素的html
 *
 * @param {StringBuffer} buf html串存储对象
 */
SlotElement.prototype.genHTML = function (buf) {
    genElementChildsHTML(this, buf);
};

/**
 * 隔离实际所属组件对其的视图更新调用。更新应由outer组件调用
 */
SlotElement.prototype.updateView = empty;

/**
 * 获取节点对应的主元素
 * slot是片段的管理，没有主元素，所以直接返回爹的主元素，不持有引用
 *
 * @protected
 * @return {HTMLElement}
 */
SlotElement.prototype._getEl = function () {
    return this.parent._getEl();
};

/**
 * 销毁释放元素行为
 */
SlotElement.prototype._dispose = function () {
    Element.prototype._disposeChilds.call(this);
    Node.prototype._dispose.call(this);
};

// #[begin] reverse
/**
 * 添加子节点的 ANode
 * 用于从 el 初始化时，需要将解析的元素抽象成 ANode，并向父级注册
 *
 * @param {ANode} aNode 抽象节点对象
 */
SlotElement.prototype._pushChildANode = Element.prototype._pushChildANode;
// #[end]


exports = module.exports = SlotElement;
