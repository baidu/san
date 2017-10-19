/**
 * @file 创建 slot 元素
 * @author errorrik(errorrik@gmail.com)
 */

var empty = require('../util/empty');
var createANode = require('../parser/create-a-node');
var NodeType = require('./node-type');
var isEndStump = require('./is-end-stump');
var genElementChildsHTML = require('./gen-element-childs-html');
var nodeInit = require('./node-init');
var nodeDispose = require('./node-dispose');
var createNodeByEl = require('./create-node-by-el');
var elementDisposeChilds = require('./element-dispose-childs');
var elementOwnPushChildANode = require('./element-own-push-child-anode');

/**
 * 创建 slot 元素
 *
 * @param {Object} options 初始化参数
 * @return {Object}
 */
function createSlot(options) {
    var literalOwner = options.owner;
    var aNode = createANode();

    // #[begin] reverse
    if (options.el) {
        if (options.stumpText.indexOf('!') !== 0) {
            options.owner = literalOwner.owner;
            options.scope = literalOwner.scope;
            options.stumpText = options.stumpText.slice(1);
        }
        this.name = options.stumpText || '____';
    }
    else {
    // #[end]

        var nameBind = options.aNode.props.get('name');
        this.name = nameBind ? nameBind.raw : '____';

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


    var node = nodeInit(options);
    node.childs = [];
    node._type = NodeType.SLOT;
    node.dispose = slotOwnDispose;

    node._getEl = slotOwnGetEl;
    node._attachHTML = slotOwnAttachHTML;
    node._update = empty;

    // #[begin] reverse
    node._pushChildANode = elementOwnPushChildANode;
    // #[end]

    var parent = node.parent;
    while (parent) {
        if (parent === node.owner) {
            parent.ownSlotChilds.push(node);
            break;
        }

        if (parent._type !== NodeType.SLOT && parent.owner === node.owner) {
            parent.slotChilds.push(node);
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
            if (!next || isEndStump(next, 'slot')) {
                next && options.elWalker.goNext();
                break;
            }

            var child = createNodeByEl(next, node, options.elWalker);
            node.childs.push(child);
            options.elWalker.goNext();
        }

        if (literalOwner !== node.owner) {
            literalOwner.aNode.givenSlots[node.name] = node.aNode;
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
function slotOwnAttachHTML(buf) {
    genElementChildsHTML(this, buf);
}

/**
 * 获取 slot 对应的主元素
 * slot 是片段的管理，没有主元素，所以直接返回爹的主元素，不持有引用
 *
 * @return {HTMLElement}
 */
function slotOwnGetEl() {
    return this.parent._getEl();
}

/**
 * 销毁释放 slot
 */
function slotOwnDispose(dontDetach) {
    elementDisposeChilds(this, dontDetach);
    nodeDispose(this);
}

exports = module.exports = createSlot;
