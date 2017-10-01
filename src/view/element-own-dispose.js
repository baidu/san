
var elementDispose = require('./element-dispose');

/**
 * 将元素attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function elementOwnDispose(dontDetach) {
    elementDispose(this, dontDetach);
    nodeDispose(this);
}

exports = module.exports = elementOwnDispose;