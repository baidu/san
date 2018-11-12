/**
 * @file 警告
 * @author errorrik(errorrik@gmail.com)
 */

var prefix = '[SAN WARNING] ';

/**
 * 警告
 *
 * @param {Object} message 警告信息
 */
function warn(message) {

    /* eslint-disable no-console */
    if (typeof console === 'object' && console.warn) {
        console.warn(prefix + message);
    }
    else {
        // 防止警告中断调用堆栈
        setTimeout(function () {
            throw new Error(prefix + message);
        });
    }
    /* eslint-enable no-console */
}

exports = module.exports = warn;
