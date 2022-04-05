/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 对元素的子节点进行反解
 */


var DOMChildrenWalker = require('./dom-children-walker');
var createReverseNode = require('./create-reverse-node');

// #[begin] reverse

/**
 * 对元素的子节点进行反解
 *
 * @param {Object} element 元素
 */
function reverseElementChildren(element, scope, owner) {
    var htmlDirective = element.aNode.directives.html;

    if (!htmlDirective) {
        var reverseWalker = new DOMChildrenWalker(element.el);
        var aNodeChildren = element.aNode.children;
        
        for (var i = 0, l = aNodeChildren.length; i < l; i++) {
            element.children.push(
                createReverseNode(aNodeChildren[i], element, scope, owner, reverseWalker)
            );
        }
    }
}
// #[end]

exports = module.exports = reverseElementChildren;
