/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 处理组件异常
 */


function handleError(e, component, info) {
    var current = component;

    while (current) {
        if (typeof current.error === 'function') {
            current.error(e, component, info);
            return;
        }

        current = current.parentComponent
    }

    throw e;
}

exports = module.exports = handleError;
