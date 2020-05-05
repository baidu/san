/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 常用标签表，用于 element 创建优化
 */

var splitStr2Obj = require('../util/split-str-2-obj');

/**
 * 常用标签表
 *
 * @type {Object}
 */
var hotTags = splitStr2Obj(
    'div,span,img,ul,ol,li,dl,dt,dd,a,b,u,hr,'
    + 'form,input,textarea,button,label,select,option,'
    + 'table,tbody,th,tr,td,thead,main,aside,header,footer,nav'
);

exports = module.exports = hotTags;
