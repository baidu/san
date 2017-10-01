
var elementAttach = require('./element-attach');

/**
 * 将元素attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function elementOwnAttach(parentEl, beforeEl) {
    if (!this.lifeCycle.is('attached')) {
        elementAttach(this, parentEl, beforeEl);
        nodeToAttached(this);
    }
}

exports = module.exports = elementOwnAttach;