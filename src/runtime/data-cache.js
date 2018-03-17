/**
 * @file 数据缓存管理器
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 数据缓存管理器
 *
 * @const
 * @type {Object}
 */
var dataCache = (function () {
    var cache = {};
    var clearly = 1;

    return {
        clear: function () {
            if (!clearly) {
                clearly = 1;
                cache = {};
            }
        },

        set: function (data, expr, value) {
            if (expr.raw) {
                clearly = 0;
                (cache[data.id] = cache[data.id] || {})[expr.raw] = value;
            }
        },

        get: function (data, expr) {
            if (expr.raw && cache[data.id]) {
                return cache[data.id][expr.raw];
            }
        }
    };
})();


exports = module.exports = dataCache;
