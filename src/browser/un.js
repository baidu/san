/**
 * @file DOM 事件卸载
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * DOM 事件卸载
 *
 * @inner
 * @param {HTMLElement} el DOM元素
 * @param {string} eventName 事件名
 * @param {Function} listener 监听函数
 * @param {boolean} capture 是否是捕获阶段
 */
function un(el, eventName, listener, capture) {
    if (el.addEventListener) {
        el.removeEventListener(eventName, listener, capture);
    }
    else {
        el.detachEvent('on' + eventName, listener);
    }
}

exports = module.exports = un;
