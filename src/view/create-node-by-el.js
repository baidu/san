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
 * @return {Node}
 */
function createNodeByEl(el, parent, elWalker) {
    var owner = isComponent(parent) ? parent : parent.owner;


    var tagName = el.tagName.toLowerCase();
    var childANode = parseANodeFromEl(el);
    var stumpName = el.getAttribute('san-stump');

    // find component class
    var ComponentClass = null;
    if (tagName.indexOf('-') > 0) {
        ComponentClass = owner.components[tagName];
    }

    var componentName = el.getAttribute('san-component');
    if (componentName) {
        ComponentClass = owner.components[componentName];
        childANode.tagName = componentName;
    }

    var option = {
        owner: owner,
        scope: owner.data,
        parent: parent,
        el: el,
        elWalker: elWalker,
        aNode: childANode
    };

    if (childANode.directives.get('if') || stumpName === 'if'
        || childANode.directives.get('else') || stumpName === 'else'
    ) {
        return new IfDirective(option);
    }

    if (childANode.directives.get('for') || stumpName === 'for') {
        return new ForDirective(option);
    }

    if (stumpName === 'slot-start') {
        return new SlotElement(option);
    }

    if (stumpName === 'data') {
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
