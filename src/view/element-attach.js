/**
 * @file 将元素attach到页面
 * @author errorrik(errorrik@gmail.com)
 */

var createHTMLBuffer = require('../runtime/create-html-buffer');
var outputHTMLBuffer = require('../runtime/output-html-buffer');
var insertBefore = require('../browser/insert-before');
var genElementChildrenHTML = require('./gen-element-children-html');
var warnSetHTML = require('./warn-set-html');

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
        var buf = createHTMLBuffer();
        genElementChildrenHTML(element, buf);

        // #[begin] error
        warnSetHTML(element.el);
        // #[end]

        outputHTMLBuffer(buf, element.el);

        element._contentReady = 1;
    }
}


exports = module.exports = elementAttach;
