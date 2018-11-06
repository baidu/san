/**
 * @file 创建组件Loader
 * @author errorrik(errorrik@gmail.com)
 */

var ComponentLoader = require('./component-loader');
var inherits = require('../util/inherits');

/**
 * 创建组件Loader
 *
 * @param {Object} proto 组件loader成员表
 * @return {Function}
 */
function defineComponentLoader(proto) {
    function LoaderClass(option) {
        ComponentLoader.call(this, option);
    }

    LoaderClass.prototype = proto;
    inherits(LoaderClass, ComponentLoader);

    return LoaderClass;
}

exports = module.exports = defineComponentLoader;
