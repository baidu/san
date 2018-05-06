/**
 * @file 计算两个对象 key 的并集
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 计算两个对象 key 的并集
 *
 * @param {Object} obj1 目标对象
 * @param {Object} obj2 源对象
 * @return {Array}
 */
function unionKeys(obj1, obj2) {
    var result = [];

    for (var key in obj1) {
        result.push(key);
    }

    for (var key in obj2) {
        !obj1[key] && result.push(key);
    }

    return result;
}

exports = module.exports = unionKeys;
