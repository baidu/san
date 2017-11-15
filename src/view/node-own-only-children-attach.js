/**
 * @file 将没有 root 只有 children 的元素 attach 到页面
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 将没有 root 只有 children 的元素 attach 到页面
 * 主要用于 slot 和 template
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function nodeOwnOnlyChildrenAttach(parentEl, beforeEl) {
    var me = this;
    each(this.aNode.children, function (aNodeChild) {
        var child = createNode(aNodeChild, me);
        if (!child._static) {
            me.children.push(child);
        }
        child.attach(parentEl, beforeEl);
    });

    attachings.done();
}

exports = module.exports = nodeOwnOnlyChildrenAttach;
