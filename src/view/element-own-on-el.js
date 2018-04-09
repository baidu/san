/**
 * @file 为元素的 el 绑定事件
 * @author errorrik(errorrik@gmail.com)
 */

var on = require('../browser/on');

/**
 * 为元素的 el 绑定事件
 *
 * @param {string} name 事件名
 * @param {Function} listener 监听器
 * @param {boolean} capture 是否是捕获阶段触发
 */
function elementOwnOnEl(name, listener, capture) {
    if (typeof listener === 'function') {
        capture = !!capture;
        this._elFns.push([name, listener, capture]);
        on(this.el, name, listener, capture);
    }
}

exports = module.exports = elementOwnOnEl;
