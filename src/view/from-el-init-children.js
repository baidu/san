/**
 * @file 遍历和编译已有元素的孩子
 * @author errorrik(errorrik@gmail.com)
 */

var createNodeByEl = require('./create-node-by-el');
var DOMChildrenWalker = require('./dom-children-walker');

// #[begin] reverse

/**
 * 遍历和编译已有元素的孩子
 *
 * @param {HTMLElement} element 已有元素
 */
function fromElInitChildren(element) {
    var walker = new DOMChildrenWalker(element.el);
    var current;
    while ((current = walker.current)) {
        var child = createNodeByEl(current, element, walker);
        if (child && !child._static) {
            element.children.push(child);
        }

        walker.goNext();
    }
}
// #[end]

exports = module.exports = fromElInitChildren;
