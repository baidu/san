/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 元素的基本属性
 */

var splitStr2Obj = require('../util/split-str-2-obj');

/**
 * 元素的基本属性
 *
 * @type {Object}
 */
var baseProps = splitStr2Obj('class,style,id');

exports = module.exports = baseProps;
