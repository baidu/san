/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 初始化节点的 s-bind 数据
 */


var evalExpr = require('../runtime/eval-expr');

/**
 * 初始化节点的 s-bind 数据
 *
 * @param {Object} sBind bind指令对象
 * @param {Model} scope 所属数据环境
 * @param {Component} owner 所属组件环境
 * @return {boolean}
 */
function nodeSBindInit(sBind, scope, owner) {
    if (sBind && scope) {
        return evalExpr(sBind.value, scope, owner);
    }
}

exports = module.exports = nodeSBindInit;
