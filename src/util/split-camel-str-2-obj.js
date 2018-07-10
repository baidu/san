/**
 * @file 将驼峰字符串逗号切分返回对象
 * @author saniac(snailsword@gmail.com)
 */

var each = require('../util/each');

/**
 * 将驼峰字符串逗号切分返回对象
 *
 * @param {string} source 源字符串
 * @return {Object}
 */
function splitCamelStr2Obj(source) {
    var result = {};
    each(
        source.split(','),
        function (key) {
            result[key.toLowerCase()] = key;
        }
    );
    return result;
}

exports = module.exports = splitCamelStr2Obj;
