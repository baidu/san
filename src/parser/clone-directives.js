/**
 * @file 复制指令集合对象
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 复制指令集合对象
 *
 * @param {Object} source 要复制的指令集合对象
 * @param {Object=} excludes 需要排除的key集合
 * @return {Object}
 */
function cloneDirectives(source, excludes) {
    var result = {};
    excludes = excludes || {};

    for (var key in source) {
        if (!excludes[key]) {
            result[key] = source[key];
        }
    }

    return result;
}

exports = module.exports = cloneDirectives;
