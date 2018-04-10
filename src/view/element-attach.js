/**
 * @file 将元素attach到页面
 * @author errorrik(errorrik@gmail.com)
 */

var createNode = require('./create-node');
var evalExpr = require('../runtime/eval-expr');
var insertBefore = require('../browser/insert-before');

/**
 * 将元素attach到页面
 *
 * @param {Object} element 元素节点
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function elementAttach(element, parentEl, beforeEl) {
    element._create();
    insertBefore(element.el, parentEl, beforeEl);

    if (!element._contentReady) {
        var htmlDirective = element.aNode.directives.html;

        if (htmlDirective) {
            element.el.innerHTML = evalExpr(htmlDirective.value, element.scope, element.owner);
        }
        else {
            var aNodeChildren = element.aNode.children;
            for (var i = 0; i < aNodeChildren.length; i++) {
                var child = createNode(aNodeChildren[i], element);
                element.children.push(child);
                child.attach(element.el);
            }
        }

        element._contentReady = 1;
    }
}


exports = module.exports = elementAttach;
