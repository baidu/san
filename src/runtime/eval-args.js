/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 为函数调用计算参数数组的值
 */


var evalExpr = require('./eval-expr');

/**
 * 为函数调用计算参数数组的值
 *
 * @param {Array} args 参数表达式列表
 * @param {Data} data 数据环境
 * @param {Component} owner 组件环境
 * @return {Array}
 */
function evalArgs(args, data, owner) {
    var result = [];
    for (var i = 0; i < args.length; i++) {
        result.push(evalExpr(args[i], data, owner));
    }

    return result;
}

exports = module.exports = evalArgs;
