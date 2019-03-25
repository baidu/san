/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 声明式事件的监听函数
 */


var evalArgs = require('../runtime/eval-args');
var findMethod = require('../runtime/find-method');
var Data = require('../runtime/data');

/**
 * 声明式事件的监听函数
 *
 * @param {Object} eventBind 绑定信息对象
 * @param {boolean} isComponentEvent 是否组件自定义事件
 * @param {Data} data 数据环境
 * @param {Event} e 事件对象
 */
function getEventListener(eventExpr, owner, data, isComponentEvent) {
    return function (e) {
        var method = findMethod(owner, eventExpr.name, data);

        if (typeof method === 'function') {
            method.apply(owner, evalArgs(
                eventExpr.args,
                new Data(
                    { $event: isComponentEvent ? e : e || window.event },
                    data
                ),
                owner
            ));
        }
    };
}

exports = module.exports = getEventListener;
