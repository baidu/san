/**
 * @file 解析插值替换
 * @author errorrik(errorrik@gmail.com)
 */

var Walker = require('./walker');
var readTertiaryExpr = require('./read-tertiary-expr');
var ExprType = require('./expr-type');
var readCall = require('./read-call');

/**
 * 解析插值替换
 *
 * @param {string} source 源码
 * @return {Object}
 */
function parseInterp(source) {
    var walker = new Walker(source);
    var expr = readTertiaryExpr(walker);

    var filters = [];
    while (walker.goUntil(124)) { // |
        filters.push(readCall(walker));
    }

    return {
        type: ExprType.INTERP,
        expr: expr,
        filters: filters
    };
}

exports = module.exports = parseInterp;
