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
 * @param {string} listener 事件监听方法名
 */
function warnEventListenMethod(name, owner, listener) {
    if (owner[listener] == null) {
        var message = '[SAN WARNING] ' + name + ' listen fail,"' + listener + '" not exist';

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

exports = module.exports = warnEventListenMethod;
