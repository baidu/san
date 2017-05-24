/**
 * @file 通过存在的 el 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */

var isComponent = require('./is-component');
var TextNode = require('./text-node');
var IfDirective = require('./if-directive');
var ForDirective = require('./for-directive');
var Element = require('./element');
var SlotElement = require('./slot-element');
var Component = require('./component');

var isStump = require('./is-stump');
var parseANodeFromEl = require('../parser/parse-anode-from-el');

// #[begin] reverse
/**
 * 通过存在的 el 创建节点
 *
 * @param {HTMLElement} el 页面中存在的元素
 * @param {Node} parent 父亲节点
 * @param {DOMChildsWalker} elWalker 遍历元素的功能对象
 * @param {Model=} scope 所属数据环境
 * @return {Node}
 */
function createNodeByEl(el, parent, elWalker, scope) {
    var owner = isComponent(parent) ? parent : parent.owner;
    scope = scope || (isComponent(parent) ? parent.data : parent.scope);

    var tagName = el.tagName.toLowerCase();
    var childANode = parseANodeFromEl(el);
    var stumpName = el.getAttribute('s-stump');

    // find component class
    var ComponentClass = null;
    if (tagName.indexOf('-') > 0) {
        ComponentClass = owner.components[tagName];
    }

    var componentName = el.getAttribute('s-component');
    if (componentName) {
        ComponentClass = owner.components[componentName];
        childANode.tagName = componentName;
    }

    var option = {
        owner: owner,
        scope: scope,
        parent: parent,
        el: el,
        elWalker: elWalker,
        aNode: childANode
    };

    if (childANode.directives.get('if') || childANode.directives.get('else')) {
        return new IfDirective(option);
    }

    switch (stumpName) {
        case 'if':
        case 'else':
            return new IfDirective(option);

        case 'for-start':
            return new ForDirective(option);

        case 'slot-start':
            return new SlotElement(option);

        case 'data':
            Component._fillData(option);
            return;
    }

    if (isStump(el)) {
        // as TextNode
        return new TextNode(option);
    }

    // as Component
    if (ComponentClass) {
        return new ComponentClass(option);
    }

    // as Element
    return new Element(option);
}
// #[end]

exports = module.exports = createNodeByEl;
