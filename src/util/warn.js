/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 开发时的警告提示
 */

// #[begin] error
/**
 * 开发时的警告提示
 *
 * @param {string} message 警告信息
 */
function warn(message) {
    message = '[SAN WARNING] ' + message;

    /* eslint-disable no-console */
    /* istanbul ignore next */
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
