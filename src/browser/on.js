/**
 * @file DOM 事件挂载
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * DOM 事件挂载
 *
 * @inner
 * @param {HTMLElement} el DOM元素
 * @param {string} eventName 事件名
 * @param {Function} listener 监听函数
 */
function on(el, eventName, listener) {
    if (el.addEventListener) {
        el.addEventListener(eventName, listener, false);
    }
    else {
        el.attachEvent('on' + eventName, listener);
    }
}

exports = module.exports = on;
