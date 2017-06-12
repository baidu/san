/**
 * @file 判断数组中是否包含某项
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('./each');

/**
 * 判断数组中是否包含某项
 *
 * @param {Array} array 数组
 * @param {*} value 包含的项
 * @return {boolean}
 */
function contains(array, value) {
    var result = false;
    each(array, function (item) {
        result = item === value;
        return !result;
    });

    return result;
}

exports = module.exports = contains;
