/**
 * @file 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */

var hotTags = require('../browser/hot-tags');
var NodeType = require('./node-type');
var TextNode = require('./text-node');
var Element = require('./element');
var SlotNode = require('./slot-node');
var ForNode = require('./for-node');
var IfNode = require('./if-node');
var TemplateNode = require('./template-node');


/**
 * 创建节点
 *
 * @param {ANode} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model=} scope 所属数据环境
 * @return {Node}
 */
function createNode(aNode, parent, scope) {
    var parentIsComponent = parent.nodeType === NodeType.CMPT;
    var owner = parentIsComponent ? parent : (parent.childOwner || parent.owner);
    scope = scope || (parentIsComponent ? parent.data : (parent.childScope || parent.scope));


    if (aNode.textExpr) {
        return new TextNode(aNode, owner, scope, parent);
    }

    if (aNode.directives['if']) { // eslint-disable-line dot-notation
        return new IfNode(aNode, owner, scope, parent);
    }

    if (aNode.directives['for']) { // eslint-disable-line dot-notation
        return new ForNode(aNode, owner, scope, parent);
    }

    if (hotTags[aNode.tagName]) {
        return new Element(aNode, owner, scope, parent);
    }



    switch (aNode.tagName) {
        case 'slot':
            return new SlotNode(aNode, owner, scope, parent);

        case 'template':
            return new TemplateNode(aNode, owner, scope, parent);

        default:
            var ComponentType = owner.getComponentType(aNode);
            if (ComponentType) {
                return new ComponentType({
                    aNode: aNode,
                    owner: owner,
                    scope: scope,
                    parent: parent,
                    subTag: aNode.tagName
                });
            }
    }

    return new Element(aNode, owner, scope, parent);
}

exports = module.exports = createNode;
