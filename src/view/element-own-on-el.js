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
 */
function elementOwnOnEl(name, listener) {
    if (typeof listener === 'function') {
        if (!this._elFns[name]) {
            this._elFns[name] = [];
        }
        this._elFns[name].push(listener);

        on(this._getEl(), name, listener);
    }
}

exports = module.exports = elementOwnOnEl;
