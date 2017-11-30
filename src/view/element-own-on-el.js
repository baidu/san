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
function elementOwnOnEl(name, listener, capture) {
    if (typeof listener === 'function') {
        capture = !!capture;

        if (!this._elFns[name]) {
            this._elFns[name] = [];
        }
        this._elFns[name].push([listener, capture]);
        
        on(this._getEl(), name, listener, capture);
    }
}

exports = module.exports = elementOwnOnEl;
