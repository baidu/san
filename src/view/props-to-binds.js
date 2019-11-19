/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 将 binds 的 name 从 kebabcase 转换成 camelcase
 */

var kebab2camel = require('../util/kebab2camel');
var ExprType = require('../parser/expr-type');

/**
 * 将 binds 的 name 从 kebabcase 转换成 camelcase
 *
 * @param {Array} binds binds集合
 * @return {Array}
 */
function propsToBinds(props) {
    var result = [];
    for (var i = 0, l = props && props.length; i < l; i++) {
        var prop = props[i];

        result.push({
            name: kebab2camel(prop.name),
            expr: prop.raw != null ? prop.expr : {
                type: ExprType.BOOL,
                value: true
            },
            x: prop.x,
            raw: prop.raw
        });
    }

    return result;
}

exports = module.exports = propsToBinds;
