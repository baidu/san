/**
 * @file 创建节点对应的 HTMLElement 主元素
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var evalExpr = require('../runtime/eval-expr');
var createEl = require('../browser/create-el');
var handleProp = require('./handle-prop');
var LifeCycle = require('./life-cycle');
var NodeType = require('./node-type');

/**
 * 创建节点对应的 HTMLElement 主元素
 */
function elementOwnCreate() {
    if (!this.lifeCycle.created) {
        this.lifeCycle = LifeCycle.painting;
        this.el = createEl(this.tagName);
        var isComponent = this.nodeType === NodeType.CMPT;

        var me = this;
        each(this.aNode.props, function (prop) {
            if (prop.name !== 'id') {
                var value = isComponent
                    ? evalExpr(prop.expr, me.data, me)
                    : evalExpr(prop.expr, me.scope, me.owner);

                handleProp.prop(me, value, prop);
            }
        });

        this.el.id = this._getElId();

        this._toPhase('created');
    }
}

exports = module.exports = elementOwnCreate;
