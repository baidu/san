/**
 * @file 处理元素的属性操作
 * @author errorrik(errorrik@gmail.com)
 */

var getPropHandler = require('./get-prop-handler');

/**
 * 处理元素属性操作
 */
var handleProp = {
    attr: function (element, value, prop) {
        var name = prop.name;
        return getPropHandler(element, name).attr(element, value, name, prop);
    },

    prop: function (element, value, prop) {
        var name = prop.name;
        getPropHandler(element, name).prop(element, value, name, prop);
    }
};

exports = module.exports = handleProp;
