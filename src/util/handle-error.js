/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 处理组件异常
 */

var warn = require('../util/warn');

function errorHandler(e, instance, info) {
    var current = instance;
    while (current) {
        var handler = current.error;
        if (typeof handler === 'function') {
            handler.call(current, e, instance, info);
            return;
        }
        current = current.parentComponent
    }

    // #[begin] error
    warn('Error in ' + instance.tagName + ' ' + info + ': ' + e.toString())
    // #[end]

    throw e;
}

exports = module.exports = errorHandler;
