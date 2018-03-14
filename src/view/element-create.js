/**
 * @file 创建节点对应的 HTMLElement 主元素
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var createEl = require('../browser/create-el');
var evalExpr = require('../runtime/eval-expr');
var NodeType = require('./node-type');
var handleProp = require('./handle-prop');
var LifeCycle = require('./life-cycle');

/**
 * 创建节点对应的 HTMLElement 主元素
 *
 * @param {Object} element 元素节点
 */
function elementCreate(element) {
    element.lifeCycle = LifeCycle.painting;
    element.el = createEl(element.tagName);
    var elementIsComponent = element.nodeType === NodeType.CMPT;

    var hasIdDeclaration;
    each(element.aNode.props, function (prop) {
        var value = elementIsComponent
            ? evalExpr(prop.expr, element.data, element)
            : evalExpr(prop.expr, element.scope, element.owner);

        handleProp.prop(element, prop.name, value);

        if (prop.name === 'id') {
            element._elId = value;
            hasIdDeclaration = true;
        }
    });

    hasIdDeclaration || (element.el.id = element.id);
}

exports = module.exports = elementCreate;
