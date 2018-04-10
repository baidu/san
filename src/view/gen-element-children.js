/**
 * @file 生成子元素
 * @author errorrik(errorrik@gmail.com)
 */

var createNode = require('./create-node');

/**
 * 生成子元素
 *
 * @param {Element} element 元素
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function genElementChildren(element, parentEl, beforeEl) {
    parentEl = parentEl || element.el;

    var aNodeChildren = element.aNode.children;
    for (var i = 0; i < aNodeChildren.length; i++) {
        var child = createNode(aNodeChildren[i], element);
        element.children.push(child);
        child.attach(parentEl, beforeEl);
    }
}

exports = module.exports = genElementChildren;
