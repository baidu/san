/**
 * @file 编译源码的中间buffer类
 * @author errorrik(errorrik@gmail.com)
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
    this.addRaw('function (data, parentCtx, givenSlots) {');
    this.addRaw('var html = "";');
};

/**
 * 添加renderer方法的结束源码
 */
CompileSourceBuffer.prototype.addRendererEnd = function () {
    this.addRaw('return html;');
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
                code.push('html += stringifier.any(' + compileExprSource.dataAccess() + ');');
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

// #[end]

exports = module.exports = CompileSourceBuffer;
