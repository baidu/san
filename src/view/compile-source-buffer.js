/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 编译源码的中间buffer类
 */

var each = require('../util/each');
var compileExprSource = require('./compile-expr-source');


// #[begin] ssr
/**
 * 编译源码的中间buffer类
 *
 * @class
 */
function CompileSourceBuffer() {
    this.segs = [];
}

/**
 * 添加原始代码，将原封不动输出
 *
 * @param {string} code 原始代码
 */
CompileSourceBuffer.prototype.addRaw = function (code) {
    this.segs.push({
        type: 'RAW',
        code: code
    });
};

/**
 * 添加被拼接为html的原始代码
 *
 * @param {string} code 原始代码
 */
CompileSourceBuffer.prototype.joinRaw = function (code) {
    this.segs.push({
        type: 'JOIN_RAW',
        code: code
    });
};

/**
 * 添加renderer方法的起始源码
 */
CompileSourceBuffer.prototype.addRendererStart = function () {
    this.addRaw('function (data, noDataOutput) {');
    this.addRaw(
        compileSourcePreCode.toString()
            .split('\n')
            .slice(1)
            .join('\n')
            .replace(/\}\s*$/, '')
    );
};

/**
 * 添加renderer方法的结束源码
 */
CompileSourceBuffer.prototype.addRendererEnd = function () {
    this.addRaw('}');
};

/**
 * 添加被拼接为html的静态字符串
 *
 * @param {string} str 被拼接的字符串
 */
CompileSourceBuffer.prototype.joinString = function (str) {
    this.segs.push({
        str: str,
        type: 'JOIN_STRING'
    });
};

/**
 * 添加被拼接为html的数据访问
 *
 * @param {Object?} accessor 数据访问表达式对象
 */
CompileSourceBuffer.prototype.joinDataStringify = function () {
    this.segs.push({
        type: 'JOIN_DATA_STRINGIFY'
    });
};

/**
 * 添加被拼接为html的表达式
 *
 * @param {Object} expr 表达式对象
 */
CompileSourceBuffer.prototype.joinExpr = function (expr) {
    this.segs.push({
        expr: expr,
        type: 'JOIN_EXPR'
    });
};

/**
 * 生成编译后代码
 *
 * @return {string}
 */
CompileSourceBuffer.prototype.toCode = function () {
    var code = [];
    var temp = '';

    function genStrLiteral() {
        if (temp) {
            code.push('html += ' + compileExprSource.stringLiteralize(temp) + ';');
        }

        temp = '';
    }

    each(this.segs, function (seg) {
        if (seg.type === 'JOIN_STRING') {
            temp += seg.str;
            return;
        }

        genStrLiteral();
        switch (seg.type) {
            case 'JOIN_DATA_STRINGIFY':
                code.push('html += "<!--s-data:" + JSON.stringify('
                    + compileExprSource.dataAccess() + ') + "-->";');
                break;

            case 'JOIN_EXPR':
                code.push('html += ' + compileExprSource.expr(seg.expr) + ';');
                break;

            case 'JOIN_RAW':
                code.push('html += ' + seg.code + ';');
                break;

            case 'RAW':
                code.push(seg.code);
                break;

        }
    });

    genStrLiteral();

    return code.join('\n');
};

/* eslint-disable no-unused-vars */
/* eslint-disable fecs-camelcase */

/**
 * 组件编译的模板函数
 *
 * @inner
 */
function compileSourcePreCode() {
    var $version = '##version##';

    var componentRenderers = {};

    function extend(target, source) {
        if (source) {
            Object.keys(source).forEach(function (key) {
                var value = source[key];
                if (typeof value !== 'undefined') {
                    target[key] = value;
                }
            });
        }

        return target;
    }

    function each(array, iterator) {
        if (array && array.length > 0) {
            for (var i = 0, l = array.length; i < l; i++) {
                if (iterator(array[i], i) === false) {
                    break;
                }
            }
        }
    }

    function contains(array, value) {
        var result;
        each(array, function (item) {
            result = item === value;
            return !result;
        });

        return result;
    }

    var HTML_ENTITY = {
        /* jshint ignore:start */
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        /* eslint-disable quotes */
        "'": '&#39;'
        /* eslint-enable quotes */
        /* jshint ignore:end */
    };

    function htmlFilterReplacer(c) {
        return HTML_ENTITY[c];
    }

    function escapeHTML(source) {
        if (source == null) {
            return '';
        }

        if (typeof source === 'string') {
            return source ? source.replace(/[&<>"']/g, htmlFilterReplacer) : '';
        }

        return '' + source;
    }

    function _classFilter(source) {
        if (source instanceof Array) {
            return source.join(' ');
        }

        return source;
    }

    function _styleFilter(source) {
        if (typeof source === 'object') {
            var result = '';
            if (source) {
                Object.keys(source).forEach(function (key) {
                    result += key + ':' + source[key] + ';';
                });
            }

            return result;
        }

        return source;
    }

    function _xclassFilter(outer, inner) {
        if (outer instanceof Array) {
            outer = outer.join(' ');
        }

        if (outer) {
            if (inner) {
                return inner + ' ' + outer;
            }

            return outer;
        }

        return inner;
    }

     function _xstyleFilter(outer, inner) {
        outer = outer && defaultStyleFilter(outer);
        if (outer) {
            if (inner) {
                return inner + ';' + outer;
            }

            return outer;
        }

        return inner;
    }

    var _baseProps = {
        'class': 1,
        'style': 1,
        'id': 1
    };

    function attrFilter(name, value, needHTMLEscape) {
        if (value) {
            return ' ' + name + '="' + (needHTMLEscape ? escapeHTML(value) : value) + '"';
        }
        else if (value != null && !_baseProps[name]) {
            return ' ' + name + '="' + value + '"';
        }

        return '';
    }

    function boolAttrFilter(name, value) {
        if (value) {
            return ' ' + name;
        }

        return '';
    }

    function callFilter(ctx, name, args) {
        var filter = ctx.proto.filters[name];
        if (typeof filter === 'function') {
            return filter.apply(ctx, args);
        }
    }
}
/* eslint-enable no-unused-vars */
/* eslint-enable fecs-camelcase */


// #[end]

exports = module.exports = CompileSourceBuffer;
