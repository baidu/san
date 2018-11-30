/**
 * @file 开发时的警告提示
 * @author errorrik(errorrik@gmail.com)
 */

// #[begin] error
/**
 * 开发时的警告提示
 *
 * @param {Object} message 警告信息
 */
function warn(message) {
    message = '[SAN WARNING] ' + message;

    /* eslint-disable no-console */
    if (typeof console === 'object' && console.warn) {
        console.warn(message);
    }
    else {
        // 防止警告中断调用堆栈
        setTimeout(function () {
            throw new Error(message);
        }, 0);
    }
    /* eslint-enable no-console */
}
// #[end]

exports = module.exports = warn;
