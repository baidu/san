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
 * @param {boolean} capture 是否是捕获阶段
 */
function on(el, eventName, listener, capture) {
    // #[begin] allua
    if (el.addEventListener) {
    // #[end]
        el.addEventListener(eventName, listener, capture);
    // #[begin] allua
    }
    else {
        el.attachEvent('on' + eventName, listener);
    }
    // #[end]
}

exports = module.exports = on;
