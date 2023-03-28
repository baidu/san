/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 对元素的子节点进行反解
 */


var DOMChildrenWalker = require('./dom-children-walker');
var createHydrateNode = require('./create-hydrate-node');

// #[begin] hydrate

/**
 * 对元素的子节点进行反解
 *
 * @param {Object} element 元素
 */
function hydrateElementChildren(element, scope, owner) {
    var htmlDirective = element.aNode.directives.html;

    if (!htmlDirective) {
        var walker = new DOMChildrenWalker(element.el);
        var aNodeChildren = element.aNode.children;
        
        for (var i = 0, l = aNodeChildren.length; i < l; i++) {
            element.children.push(
                createHydrateNode(aNodeChildren[i], element, scope, owner, walker)
            );
        }
    }
}
// #[end]

exports = module.exports = hydrateElementChildren;
