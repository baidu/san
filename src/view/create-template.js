/**
 * @file 创建 template 元素
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var empty = require('../util/empty');

var NodeType = require('./node-type');
var genElementChildrenHTML = require('./gen-element-children-html');
var nodeInit = require('./node-init');
var nodeDispose = require('./node-dispose');
var isEndStump = require('./is-end-stump');
var createNode = require('./create-node');
var createNodeByEl = require('./create-node-by-el');
var elementDisposeChildren = require('./element-dispose-children');
var elementOwnPushChildANode = require('./element-own-push-child-anode');
var attachings = require('./attachings');
var elementUpdateChildren = require('./element-update-children');
var LifeCycle = require('./life-cycle');

/**
 * 创建 template 元素
 *
 * @param {Object} options 初始化参数
 * @return {Object}
 */
function createTemplate(options) {
    var node = nodeInit(options);

    node.lifeCycle = LifeCycle.start;
    node.children = [];

    node._type = NodeType.TEMPLATE;

    node.attach = templateOwnAttach;
    node.dispose = templateOwnDispose;


    node._toPhase = elementOwnToPhase;
    node._getEl = empty;
    node._attachHTML = templateOwnAttachHTML;
    node._attached = templateOwnAttached;
    node._update = templateOwnUpdate;

    // #[begin] reverse
    node._pushChildANode = elementOwnPushChildANode;
    // #[end]

    node.aNode = node.aNode || createANode();

    // #[begin] reverse
    if (options.el) {
        attachings.add(node);
        removeEl(options.el);
        options.el = null;

        /* eslint-disable no-constant-condition */
        while (1) {
        /* eslint-enable no-constant-condition */
            var next = options.elWalker.next;
            if (isEndStump(next, 'tpl')) {
                options.elWalker.goNext();
                removeEl(next);
                break;
            }

            options.elWalker.goNext();
            var child = createNodeByEl(next, node, options.elWalker);
            child && node.children.push(child);
        }

        node.parent._pushChildANode(node.aNode);
    }
    else {
    // #[end]
        var aNodeChildren = node.aNode.children;
        var len = aNodeChildren.length;

        if (len) {
            if (aNodeChildren[--len].isText) {
                aNodeChildren.length = len;
            }

            if (len && aNodeChildren[0].isText) {
                aNodeChildren.splice(0, 1);
            }
        }
    // #[begin] reverse
    }
    // #[end]

    return node;
}

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
function templateOwnUpdate(changes) {
    elementUpdateChildren(this, changes);
}

/**
 * 将元素attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function templateOwnAttach(parentEl, beforeEl) {
    var me = this;
    each(this.aNode.children, function (aNodeChild) {
        var child = createNode(aNodeChild, me);
        if (!child._static) {
            me.children.push(child);
        }
        child.attach(parentEl, beforeEl);
    });

    attachings.done();
}

/**
 * 执行完成attached状态的行为
 */
function templateOwnAttached() {
    this._toPhase('attached');
}

/**
 * attach 元素的 html
 *
 * @param {Object} buf html串存储对象
 */
function templateOwnAttachHTML(buf) {
    genElementChildrenHTML(this, buf);
    attachings.add(this);
}

/**
 * 销毁释放
 */
function templateOwnDispose(dontDetach) {
    elementDisposeChildren(this, dontDetach);
    nodeDispose(this);
}

exports = module.exports = createTemplate;
