/**
 * @file 将元素attach到页面
 * @author errorrik(errorrik@gmail.com)
 */

var createHTMLBuffer = require('../runtime/create-html-buffer');
var outputHTMLBuffer = require('../runtime/output-html-buffer');
var insertBefore = require('../browser/insert-before');
var genElementChildrenHTML = require('./gen-element-children-html');
var genElementChildren = require('./gen-element-children');

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
        // // #[begin] allua
        // if (element.aNode.hotspot.noSetHTML) {
        //     genElementChildren(element);
        // }
        // else {
        // // #[end]
        //     var buf = createHTMLBuffer();
        //     genElementChildrenHTML(element, buf);
        //     outputHTMLBuffer(buf, element.el);
        // // #[begin] allua
        // }
        // // #[end]

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
