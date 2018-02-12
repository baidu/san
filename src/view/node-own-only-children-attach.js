/**
 * @file 将没有 root 只有 children 的元素 attach 到页面
 * @author errorrik(errorrik@gmail.com)
 */


var each = require('../util/each');
var insertBefore = require('../browser/insert-before');
var createNode = require('./create-node');
var nodeCreateStump = require('./node-create-stump');
var attachings = require('./attachings');


/**
 * 将没有 root 只有 children 的元素 attach 到页面
 * 主要用于 slot 和 template
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function nodeOwnOnlyChildrenAttach(parentEl, beforeEl) {
    var me = this;

    me.sel = nodeCreateStump(me);
    insertBefore(me.sel, parentEl, beforeEl);

    each(this.aNode.children, function (aNodeChild) {
        var child = createNode(aNodeChild, me);
        me.children.push(child);
        child.attach(parentEl, beforeEl);
    });

    me.el = nodeCreateStump(me);
    insertBefore(me.el, parentEl, beforeEl);

    attachings.done();
}

exports = module.exports = nodeOwnOnlyChildrenAttach;
