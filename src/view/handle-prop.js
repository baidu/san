/**
 * @file 处理元素的属性操作
 * @author errorrik(errorrik@gmail.com)
 */

var getPropHandler = require('./get-prop-handler');

/**
 * 处理元素属性操作
 */
var handleProp = {
    prop: function (element, value, prop) {
        var name = prop.name;
        getPropHandler(element.tagName, name).prop(element.el, value, name, element, prop);
    }
};

exports = module.exports = handleProp;
