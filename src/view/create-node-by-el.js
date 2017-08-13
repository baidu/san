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

    var option = {
        owner: owner,
        scope: scope,
        parent: parent,
        el: el,
        elWalker: elWalker
    };

    // comment as stump
    if (el.nodeType === 8) {
        var stumpMatch = el.data.match(/^\s*s-([a-z]+)(:[\s\S]+)?$/);

        if (stumpMatch) {
            option.stumpText = stumpMatch[2] ? stumpMatch[2].slice(1) : '';

            switch (stumpMatch[1]) {
                case 'text':
                    return new TextNode(option);

                case 'for':
                    return new ForDirective(option);

                case 'slot':
                    return new SlotElement(option);

                case 'if':
                case 'else':
                    return new IfDirective(option);

                case 'data':
                    // fill component data
                    var data = (new Function(
                        'return ' + option.stumpText.replace(/^[\s\n]*/ ,'')
                    ))();

                    for (var key in data) {
                        owner.data.set(key, data[key]);
                    }

                    return;
            }
        }

        return;
    }

    // element as anything
    var tagName = el.tagName.toLowerCase();
    var childANode = parseANodeFromEl(el);
    option.aNode = childANode;

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


    if (childANode.directives.get('if') || childANode.directives.get('else')) {
        return new IfDirective(option);
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
