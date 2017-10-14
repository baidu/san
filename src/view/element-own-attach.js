/**
 * @file 将元素attach到页面
 * @author errorrik(errorrik@gmail.com)
 */


var elementAttach = require('./element-attach');
var attachings = require('./attachings');

/**
 * 将元素attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function elementOwnAttach(parentEl, beforeEl) {
    if (!this.lifeCycle.is('attached')) {
        elementAttach(this, parentEl, beforeEl);
        attachings.add(this);
        attachings.done();

        this._toPhase('attached');
    }
}

exports = module.exports = elementOwnAttach;
