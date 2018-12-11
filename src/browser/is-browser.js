/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 是否浏览器环境
 */

var isBrowser = typeof window !== 'undefined';

exports = module.exports = isBrowser;
