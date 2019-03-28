/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建节点的工厂方法
 */

var Element = require('./element');
var AsyncComponent = require('./async-component');


/**
 * 创建节点
 *
 * @param {ANode} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @return {Node}
 */
function createNode(aNode, parent, scope, owner) {
    if (aNode.Clazz) {
        return new aNode.Clazz(aNode, parent, scope, owner);
    }

    var ComponentOrLoader = owner.getComponentType
        ? owner.getComponentType(aNode)
        : owner.components[aNode.tagName];

    if (ComponentOrLoader) {
        return typeof ComponentOrLoader === 'function'
            ? new ComponentOrLoader({
                source: aNode,
                owner: owner,
                scope: scope,
                parent: parent,
                subTag: aNode.tagName
            })
            : new AsyncComponent({
                source: aNode,
                owner: owner,
                scope: scope,
                parent: parent,
                subTag: aNode.tagName
            }, ComponentOrLoader);
    }

    aNode.Clazz = Element;
    return new Element(aNode, parent, scope, owner);
}

exports = module.exports = createNode;
