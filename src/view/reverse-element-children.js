/**
 * @file 对元素的子节点进行反解
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var DOMChildrenWalker = require('./dom-children-walker');
var createReverseNode = require('./create-reverse-node');

// #[begin] reverse

/**
 * 对元素的子节点进行反解
 *
 * @param {Object} element 元素
 */
function reverseElementChildren(element) {
    var htmlDirective = element.aNode.directives.html;

    if (!htmlDirective) {
        var reverseWalker = new DOMChildrenWalker(element.el);

        each(element.aNode.children, function (aNodeChild) {
            element.children.push(createReverseNode(aNodeChild, reverseWalker, element));
        });
    }
}
// #[end]

exports = module.exports = reverseElementChildren;
