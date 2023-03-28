/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 通过组件反解创建节点的工厂方法
 */

var Element = require('./element');
var FragmentNode = require('./fragment-node');
var AsyncComponent = require('./async-component');

// #[begin] hydrate
/**
 * 通过组件反解创建节点
 *
 * @param {ANode} aNode 抽象节点
 * @param {Node} parent 父亲节点
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {DOMChildrenWalker} hydrateWalker 子元素遍历对象
 * @return {Node}
 */
function createHydrateNode(aNode, parent, scope, owner, hydrateWalker, componentName) {
    if (aNode.elem) {
        return new Element(aNode, parent, scope, owner, componentName, hydrateWalker);
    }

    if (aNode.Clazz) {
        return new aNode.Clazz(aNode, parent, scope, owner, hydrateWalker);
    }

    var ComponentOrLoader = owner.components && owner.components[componentName || aNode.tagName];

    if (ComponentOrLoader) {
        return typeof ComponentOrLoader === 'function'
            ? new ComponentOrLoader({
                source: aNode,
                owner: owner,
                scope: scope,
                parent: parent,
                hydrateWalker: hydrateWalker
            })
            : new AsyncComponent({
                source: aNode,
                owner: owner,
                scope: scope,
                parent: parent,
                hydrateWalker: hydrateWalker
            }, ComponentOrLoader);
    }

    if (aNode.directives.is) {
        switch (componentName) {
            case 'fragment':
            case 'template':
                    return new FragmentNode(aNode, parent, scope, owner, hydrateWalker);
        }
    }
    else {
        aNode.elem = true;
    }
    return new Element(aNode, parent, scope, owner, componentName, hydrateWalker);
}
// #[end]

exports = module.exports = createHydrateNode;
