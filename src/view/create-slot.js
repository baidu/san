/**
 * @file slot元素类
 * @author errorrik(errorrik@gmail.com)
 */

var inherits = require('../util/inherits');
var each = require('../util/each');
var empty = require('../util/empty');
var isComponent = require('./is-component');
var Component = require('./component');
var createANode = require('../parser/create-a-node');
var isEndStump = require('./is-end-stump');
var genElementChildsHTML = require('./gen-element-childs-html');

/**
 * slot 元素类
 *
 * @param {Object} options 初始化参数
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
    node._type = 'san-slot';

    node._getEl = slotOwnGetEl;
    node.genHTML = slotOwnGenHTML;
    node.updateView = empty;
    node.dispose = slotOwnDispose;
    node._toPhase = nodeOwnToPhase;
    node._toAttached = nodeOwnToAttached;

    // #[begin] reverse
    node._pushChildANode = elementOwnPushChildANode;
    // #[end]

    var parent = node.parent;
    while (parent) {
        if (parent === node.owner) {
            parent.ownSlotChilds.push(node);
            break;
        }

        if (parent._type !== 'san-slot' && parent.owner === node.owner) {
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
 * 生成元素的html
 *
 * @param {StringBuffer} buf html串存储对象
 */
function slotOwnGenHTML(buf) {
    genElementChildsHTML(this, buf);
};

/**
 * 获取节点对应的主元素
 * slot是片段的管理，没有主元素，所以直接返回爹的主元素，不持有引用
 *
 * @protected
 * @return {HTMLElement}
 */
function slotOwnGetEl() {
    return this.parent._getEl();
}

/**
 * 销毁释放元素行为
 */
function slotOwnDispose() {
    elementDisposeChilds(this);
    nodeDispose(this);

    this.lifeCycle.set('disposed')
};

exports = module.exports = createSlot;
