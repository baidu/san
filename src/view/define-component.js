/**
 * @file 创建组件类
 * @author errorrik(errorrik@gmail.com)
 */

var Component = require('./component');
var inherits = require('../util/inherits');

/**
 * 创建组件类
 *
 * @param {Object} proto 组件类的方法表
 * @return {Function}
 */
function defineComponent(proto) {
    function ComponentClass(option) {
        Component.call(this, option);
    }

    ComponentClass.prototype = proto;
    inherits(ComponentClass, Component);

    return ComponentClass;
}

exports = module.exports = defineComponent;
