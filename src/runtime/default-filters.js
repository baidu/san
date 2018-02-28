/**
 * @file 默认filter
 * @author errorrik(errorrik@gmail.com)
 */


/* eslint-disable fecs-camelcase */
/* eslint-disable guard-for-in */

/**
 * 默认filter
 *
 * @const
 * @type {Object}
 */
var DEFAULT_FILTERS = {

    /**
     * URL编码filter
     *
     * @param {string} source 源串
     * @return {string} 替换结果串
     */
    url: encodeURIComponent,

    _class: function (source) {
        if (source instanceof Array) {
            return source.join(' ');
        }

        return source;
    },

    _style: function (source) {
        if (typeof source === 'object') {
            var result = '';
            for (var key in source) {
                result += key + ':' + source[key] + ';';
            }

            return result;
        }

        return source;
    },

    _sep: function (source, sep) {
        return source ? sep + source : source;
    }
};
/* eslint-enable fecs-camelcase */

exports = module.exports = DEFAULT_FILTERS;
