/**
 * @file 将没有 root 只有 children 的元素 attach 到页面
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var insertBefore = require('../browser/insert-before');
var createNode = require('./create-node');
var genElementChildren = require('./gen-element-children');
var attachings = require('./attachings');


/**
 * 将没有 root 只有 children 的元素 attach 到页面
 * 主要用于 slot 和 template
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function nodeOwnOnlyChildrenAttach(parentEl, beforeEl) {
    this.sel = document.createComment(this.id);
    insertBefore(this.sel, parentEl, beforeEl);

    genElementChildren(this, parentEl, beforeEl);

    this.el = document.createComment(this.id);
    insertBefore(this.el, parentEl, beforeEl);

    attachings.done();
}

exports = module.exports = nodeOwnOnlyChildrenAttach;
