/**
 * @file 将字符串逗号切分返回对象
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');

/**
 * 将字符串逗号切分返回对象
 *
 * @param {string} source 源字符串
 * @return {Object}
 */
function splitStr2Obj(source) {
    var result = {};
    each(
        source.split(','),
        function (key) {
            result[key] = 1;
        }
    );
    return result;
}

exports = module.exports = splitStr2Obj;
