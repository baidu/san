/**
 * @file 创建组件Loader
 * @author errorrik(errorrik@gmail.com)
 */

var ComponentLoader = require('./component-loader');

/**
 * 创建组件Loader
 *
 * @param {Object} options loader参数
 * @param {Function} options.load load方法
 * @param {Function=} options.loading loading过程中渲染的组件
 * @param {Function=} options.fallback load失败时渲染的组件
 * @return {ComponentLoader}
 */
function createComponentLoader(options) {
    if (options && typeof options.load === 'function') {
        return new ComponentLoader(options);
    }
}

exports = module.exports = createComponentLoader;
