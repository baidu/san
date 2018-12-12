/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 创建组件Loader
 */

var ComponentLoader = require('./component-loader');

/**
 * 创建组件Loader
 *
 * @param {Object|Function} options 创建组件Loader的参数。为Object时参考下方描述，为Function时代表load方法。
 * @param {Function} options.load load方法
 * @param {Function=} options.placeholder loading过程中渲染的占位组件
 * @param {Function=} options.fallback load失败时渲染的组件
 * @return {ComponentLoader}
 */
function createComponentLoader(options) {
    var placeholder = options.placeholder;
    var fallback = options.fallback;
    var load = typeof options === 'function' ? options : options.load;

    return new ComponentLoader(load, placeholder, fallback);
}

exports = module.exports = createComponentLoader;
