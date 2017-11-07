/**
 * @file  事件绑定不存在的 warning
 * @author varsha(wangshuonpu@gmail.com)
 */

// #[begin] error
/**
 * 事件绑定不存在的 warning
 *
 * @param {string} name 事件名
 * @param {Component} owner 所属的组件对象
 * @param {Function} listener 监听器
 */
function warnEventBind(name, owner, listener) {
    if (typeof owner[listener] === 'undefined') {
        var message = '[SAN WARNING] on ' + name + ' event listener "' + listener + '" may not defined';

        /* eslint-disable no-console */
        if (typeof console === 'object' && console.warn) {
            console.warn(message);
        }
        else {
            throw new Error(message);
        }
        /* eslint-enable no-console */
    }
}
// #[end]

exports = module.exports = warnEventBind;
