/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 更新节点的 s-bind 数据
 */

var unionKeys = require('../util/union-keys');
var evalExpr = require('../runtime/eval-expr');
var changeExprCompare = require('../runtime/change-expr-compare');

/**
 * 更新节点的 s-bind 数据
 *
 * @param {Object} sBind bind指令对象
 * @param {Object} oldBindData 当前s-bind数据
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @param {Array} changes 变更数组
 * @param {Function} updater 绑定对象子项变更的更新函数
 */
function nodeSBindUpdate(sBind, oldBindData, scope, owner, changes, updater) {
    if (sBind) {
        var len = changes.length;

        while (len--) {
            if (changeExprCompare(changes[len].expr, sBind.value, scope)) {
                var newBindData = evalExpr(sBind.value, scope, owner);
                var keys = unionKeys(newBindData, oldBindData);

                for (var i = 0, l = keys.length; i < l; i++) {
                    var key = keys[i];
                    var value = newBindData[key];

                    if (value !== oldBindData[key]) {
                        updater(key, value);
                    }
                }

                return newBindData;
            }

        }
    }
}

exports = module.exports = nodeSBindUpdate;
