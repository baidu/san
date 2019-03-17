/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 给 devtool 发通知消息
 */

var isBrowser = require('../browser/is-browser');

// #[begin] devtool
var san4devtool;

/**
 * 给 devtool 发通知消息
 *
 * @param {string} name 消息名称
 * @param {*} arg 消息参数
 */
function emitDevtool(name, arg) {
    /* istanbul ignore if */
    if (isBrowser && san4devtool && san4devtool.debug && window.__san_devtool__) {
        window.__san_devtool__.emit(name, arg);
    }
}

emitDevtool.start = function (main) {
    san4devtool = main;
    emitDevtool('san', main);
};
// #[end]

exports = module.exports = emitDevtool;
