/**
 * @file 处理元素的属性操作
 * @author errorrik(errorrik@gmail.com)
 */

var getPropHandler = require('./get-prop-handler');

/**
 * 处理元素属性操作
 */
var handleProp = {
    attr: function (element, name, value) {
        return getPropHandler(element, name).attr(element, name, value);
    },

    prop: function (element, name, value) {
        getPropHandler(element, name).prop(element, name, value);
    }
};

exports = module.exports = handleProp;
