/**
 * @file 遍历和编译已有元素的孩子
 * @author errorrik(errorrik@gmail.com)
 */

var createNodeByEl = require('./create-node-by-el');

// #[begin] reverse
/**
 * 元素子节点遍历操作对象
 *
 * @inner
 * @class
 * @param {HTMLElement} el 要遍历的元素
 */
function DOMChildrenWalker(el) {
    this.raw = [];
    this.index = 0;

    var child = el.firstChild;
    while (child) {
        switch (child.nodeType) {
            case 1:
            case 8:
                this.raw.push(child);
        }

        child = child.nextSibling;
    }

    this.current = this.raw[this.index];
    this.next = this.raw[this.index + 1];
}

/**
 * 往下走一个元素
 */
DOMChildrenWalker.prototype.goNext = function () {
    this.current = this.raw[++this.index];
    this.next = this.raw[this.index + 1];
};

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
