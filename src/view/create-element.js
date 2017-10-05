
var elementOwnAttachHTML = require('./element-own-attach-html');
var elementOwnCreate = require('./element-own-create');
var elementOwnAttach = require('./element-own-attach');
var elementOwnDetach = require('./element-own-detach');
var elementOwnDispose = require('./element-own-dispose');
var elementAttached = require('./element-attached');
var elementInitProps = require('./element-init-props');
var elementInitTagName = require('./element-init-tag-name');
var elementOwnPushChildANode = require('./element-own-push-child-anode');

function createElement(options) {
    var node = nodeInit(options);
    
    // init methods
    node.attach = elementOwnAttach;
    node.detach = elementOwnDetach;
    node.dispose = elementOwnDispose;
    node._attachHTML = elementOwnAttachHTML;
    node._update = elementOwnUpdate;
    node._create = elementOwnCreate;
    node._attached = elementOwnAttached;
    node.setProp = elementOwnSetProp;
    node._getEl = elementOwnGetEl;
    node._toPhase = elementOwnToPhase;
    
    elementInitProps(node);

    // #[begin] reverse
    node._pushChildANode = elementOwnPushChildANode;

    if (node.el) {
        node.aNode = parseANodeFromEl(node.el);
        node.parent && node.parent._pushChildANode(node.aNode);
        node.tagName = node.aNode.tagName;
    
        if (!node.aNode.directives.get('html')) {
            fromElInitChilds(node);
        }
        node.el.id = node.id;
        attachings.add(node);
    }
    // #[end]

    elementInitTagName(node);
    node.props = node.aNode.props;
    node.binds = node.aNode.binds || node.aNode.props;

    node._toPhase('inited');
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

    this.props.each(function (prop) {
        if (prop.expr.value) {
            return;
        }

        each(changes, function (change) {
            if (!isDataChangeByElement(change, me, prop.name)
                && changeExprCompare(change.expr, prop.expr, me.scope)
            ) {
                me.setProp(prop.name, nodeEvalExpr(me, prop.expr));
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
        elementUpdateChilds(this, changes);
    }
}

function elementOwnAttached() {
    elementAttached(this);
}

function elementOwnGetEl() {
    if (!this.el) {
        this.el = document.getElementById(this.id);
    }

    return this.el;
}

function elementOwnToPhase(name) {
    this.lifeCycle.set(name);
}


exports = module.exports = createElement;
