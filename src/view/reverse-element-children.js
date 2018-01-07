/**
 * @file 对元素的子节点进行反解
 * @author errorrik(errorrik@gmail.com)
 */


var DOMChildrenWalker = require('./dom-children-walker');
var createReverseNode = require('./create-reverse-node');

// #[begin] reverse

/**
 * 对元素的子节点进行反解
 *
 * @param {Object} element 元素
 */
function reverseElementChildren(element) {
    var reverseWalker = new DOMChildrenWalker(element.el);
    var htmlDirective = element.aNode.directives.get('html');

    if (!htmlDirective) {
        each(element.aNode.children, function (aNodeChild) {
            var child = createReverseNode(aNodeChild, reverseWalker, element);
            if (!child._static) {
                element.children.push(child);
            }
        });
    }
}
// #[end]

exports = module.exports = reverseElementChildren;
