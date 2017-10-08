/**
 * @file 为元素的 el 绑定事件
 * @author errorrik(errorrik@gmail.com)
 */

var on = require('../browser/on');

/**
 * 为元素的 el 绑定事件
 *
 * @param {Object} element 元素节点
 * @param {string} name 事件名
 * @param {Function} listener 监听器
 */
function elementAddElEvent(element, name, listener) {
    if (typeof listener === 'function') {
        if (!element._elFns[name]) {
            element._elFns[name] = [];
        }
        element._elFns[name].push(listener);

        on(element._getEl(), name, listener);
    }
}

exports = module.exports = elementAddElEvent;
