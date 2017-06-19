/**
 * @file 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */


var isComponent = require('./is-component');
var TextNode = require('./text-node');
var Element = require('./element');
var SlotElement = require('./slot-element');
var Component = require('./component');
var ForDirective = require('./for-directive');
var IfDirective = require('./if-directive');


/**
 * 创建节点
 *
 * @param {ANode} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model=} scope 所属数据环境
 * @return {Node}
 */
function createNode(aNode, parent, scope) {
    var owner = isComponent(parent) ? parent : parent.owner;
    scope = scope || (isComponent(parent) ? parent.data : parent.scope);
    var options = {
        aNode: aNode,
        owner: owner,
        scope: scope,
        parent: parent
    };

    if (aNode.isText) {
        return new TextNode(options);
    }

    if (aNode.directives.get('if') || aNode.directives.get('else')) {
        return new IfDirective(options);
    }

    if (aNode.directives.get('for')) {
        return new ForDirective(options);
    }

    var ComponentType = owner.components[aNode.tagName];
    if (ComponentType) {
        options.subTag = aNode.tagName;
        return new ComponentType(options);
    }

    if (aNode.tagName === 'slot') {
        return new SlotElement(options);
    }

    return new Element(options);
}

exports = module.exports = createNode;
