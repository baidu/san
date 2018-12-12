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
 * 初始化节点的 s-bind 数据
 *
 * @param {Object} node 节点对象
 * @param {Object} sBind bind指令对象
 * @param {Array} changes 变更数组
 * @param {Function} updater 绑定对象子项变更的更新函数
 */
function nodeSBindUpdate(node, sBind, changes, updater) {
    if (sBind) {
        var len = changes.length;

        while (len--) {
            if (changeExprCompare(changes[len].expr, sBind.value, node.scope)) {
                var newBindData = evalExpr(sBind.value, node.scope, node.owner);
                var keys = unionKeys(newBindData, node._sbindData);

                for (var i = 0, l = keys.length; i < l; i++) {
                    var key = keys[i];
                    var value = newBindData[key];

                    if (value !== node._sbindData[key]) {
                        updater(key, value);
                    }
                }

                node._sbindData = newBindData;
                break;
            }

        }
    }
}

exports = module.exports = nodeSBindUpdate;
