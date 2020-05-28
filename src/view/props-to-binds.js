/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将组件外部声明的 props 处理转换成 binds
 */

var kebab2camel = require('../util/kebab2camel');
var ExprType = require('../parser/expr-type');

/**
 * 将组件外部声明的 props 处理转换成 binds
 * 1. name kebabcase 转换成 camelcase
 * 2. 只包含 name 不包含 value 的声明，默认为 true
 *
 * @param {Array} binds binds集合
 * @return {Array}
 */
function propsToBinds(props) {
    var result = [];
    for (var i = 0, l = props && props.length; i < l; i++) {
        var prop = props[i];

        // TODO: 看看在preheat时候是不是已经做掉了，或者能不能做掉
        result.push({
            name: kebab2camel(prop.name),
            expr: prop.noValue 
                ? {type: ExprType.BOOL, value: true}
                : prop.expr,
            x: prop.x,
            noValue: prop.noValue
        });
    }

    return result;
}

exports = module.exports = propsToBinds;
