/**
 * @file 创建节点的工厂方法
 * @author errorrik(errorrik@gmail.com)
 */


var isComponent = require('./is-component');
var createText = require('./create-text');
var createElement = require('./create-element');
var createSlot = require('./create-slot');
var createFor = require('./create-for');
var createIf = require('./create-if');
var createTemplate = require('./create-template');


/**
 * 创建节点
 *
 * @param {ANode} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model=} scope 所属数据环境
 * @return {Node}
 */
function createNode(aNode, parent, scope) {
    var owner = isComponent(parent) ? parent : (parent.childOwner || parent.owner);
    scope = scope || (isComponent(parent) ? parent.data : (parent.childScope || parent.scope));
    var options = {
        aNode: aNode,
        owner: owner,
        scope: scope,
        parent: parent
    };

    if (aNode.textExpr) {
        return createText(options);
    }

    if (aNode.directives['if']) { // eslint-disable-line dot-notation
        return createIf(options);
    }

    if (aNode.directives['for']) { // eslint-disable-line dot-notation
        return createFor(options);
    }

    var ComponentType = owner.getComponentType(aNode);
    if (ComponentType) {
        options.subTag = aNode.tagName;
        return new ComponentType(options);
    }

    switch (aNode.tagName) {
        case 'slot':
            return createSlot(options);

        case 'template':
            return createTemplate(options);
    }

    return createElement(options);
}

exports = module.exports = createNode;
