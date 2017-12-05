/**
 * @file 解析调用
 * @author errorrik(errorrik@gmail.com)
 */


var Walker = require('./walker');
var readCall = require('./read-call');

/**
 * 解析调用
 *
 * @param {string} source 源码
 * @param {Array=} defaultArgs 默认参数
 * @return {Object}
 */
function parseCall(source, defaultArgs) {
    var expr = readCall(new Walker(source), defaultArgs);
    expr.raw = source;
    return expr;
}

exports = module.exports = parseCall;
