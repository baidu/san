/**
 * @file 创建 element 节点
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var IndexedList = require('../util/indexed-list');
var changeExprCompare = require('../runtime/change-expr-compare');
var attachings = require('./attachings');
var NodeType = require('./node-type');
var reverseElementChildren = require('./reverse-element-children');
var isDataChangeByElement = require('./is-data-change-by-element');
var nodeInit = require('./node-init');
var nodeEvalExpr = require('./node-eval-expr');
var elementUpdateChildren = require('./element-update-children');
var elementOwnAttachHTML = require('./element-own-attach-html');
var elementOwnCreate = require('./element-own-create');
var elementOwnAttach = require('./element-own-attach');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var elementOwnGetEl = require('./element-own-get-el');
var elementOwnOnEl = require('./element-own-on-el');
var elementOwnToPhase = require('./element-own-to-phase');
var elementAttached = require('./element-attached');
var elementSetElProp = require('./element-set-el-prop');
var elementInitProps = require('./element-init-props');
var elementInitTagName = require('./element-init-tag-name');
var elementOwnPushChildANode = require('./element-own-push-child-anode');
var warnSetHTML = require('./warn-set-html');

/**
 * 创建 element 节点
 *
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 * @return {Object}
 */
function createElement(options) {
    var node = nodeInit(options);
    node.nodeType = NodeType.ELEM;

    // init methods
    node.attach = elementOwnAttach;
    node.detach = elementOwnDetach;
    node.dispose = elementOwnDispose;
    node._attachHTML = elementOwnAttachHTML;
    node._update = elementOwnUpdate;
    node._create = elementOwnCreate;
    node._attached = elementOwnAttached;
    node._getEl = elementOwnGetEl;
    node._toPhase = elementOwnToPhase;
    node._onEl = elementOwnOnEl;

    elementInitProps(node);
    elementInitTagName(node);
    node.props = node.aNode.props;
    node.binds = node.aNode.binds || node.aNode.props;

    node._toPhase('inited');

    // #[begin] reverse
    if (node.walker) {
        var currentNode = options.walker.current;
        if (currentNode && currentNode.nodeType === 1) {
            node.el = currentNode;
            node.el.id = node.id;
            options.walker.goNext();
        }

        reverseElementChildren(node);

        node.dynamicProps = new IndexedList();
        node.aNode.props.each(function (prop) {
            if (!prop.attr) {
                node.dynamicProps.push(prop);
            }
        });
        attachings.add(node);
    }
    // #[end]

    return node;
}

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
function elementOwnUpdate(changes) {
    this._getEl();
    var me = this;

    this.dynamicProps.each(function (prop) {
        if (prop.expr.value) {
            return;
        }

        each(changes, function (change) {
            if (!isDataChangeByElement(change, me, prop.name)
                && (
                    changeExprCompare(change.expr, prop.expr, me.scope)
                    || prop.hintExpr && changeExprCompare(change.expr, prop.hintExpr, me.scope)
                )
            ) {
                elementSetElProp(me, prop.name, nodeEvalExpr(me, prop.expr));
                return false;
            }
        });
    });

    var htmlDirective = this.aNode.directives.get('html');
    if (htmlDirective) {
        each(changes, function (change) {
            if (changeExprCompare(change.expr, htmlDirective.value, me.scope)) {
                // #[begin] error
                warnSetHTML(me.el);
                // #[end]
                me.el.innerHTML = nodeEvalExpr(me, htmlDirective.value);
                return false;
            }
        });
    }
    else {
        elementUpdateChildren(this, changes);
    }
}

/**
 * 执行完成attached状态的行为
 */
function elementOwnAttached() {
    elementAttached(this);
}



exports = module.exports = createElement;
