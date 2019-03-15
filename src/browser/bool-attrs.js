/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file bool属性表
 */


var splitStr2Obj = require('../util/split-str-2-obj');

/**
 * bool属性表
 *
 * @type {Object}
 */
var boolAttrs = splitStr2Obj(
    'allowpaymentrequest,async,autofocus,autoplay,'
    + 'checked,controls,default,defer,disabled,formnovalidate,'
    + 'hidden,ismap,itemscope,loop,multiple,muted,nomodule,novalidate,'
    + 'open,readonly,required,reversed,selected,typemustmatch'
);

exports = module.exports = boolAttrs;
