/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 默认filter
 */


/* eslint-disable fecs-camelcase */


function defaultClassFilter(source) {
    if (source instanceof Array) {
        return source.join(' ');
    }

    return source;
}

function defaultStyleFilter(source) {
    if (typeof source === 'object') {
        var result = '';
        for (var key in source) {
            /* istanbul ignore else  */
            if (source.hasOwnProperty(key)) {
                result += key + ':' + source[key] + ';';
            }
        }

        return result;
    }

    return source;
}

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

    _class: defaultClassFilter,
    _style: defaultStyleFilter,

    _xclass: function (source) {
        var result = defaultClassFilter(source);
        return result ? ' ' + result : '';
    },

    _xstyle: function (source) {
        var result = defaultStyleFilter(source);
        return result ? ';' + result : '';
    }
};
/* eslint-enable fecs-camelcase */

exports = module.exports = DEFAULT_FILTERS;
