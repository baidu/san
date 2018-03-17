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

    var interp = {
        type: ExprType.INTERP,
        expr: readTertiaryExpr(walker),
        filters: [],
        raw: source
    };

    while (walker.goUntil(124)) { // |
        var callExpr = readCall(walker);
        switch (callExpr.name.paths[0].value) {
            case 'html':
                break;
            case 'raw':
                interp.original = 1;
                break;
            default:
                interp.filters.push(callExpr);
        }
    }

    return interp;
}

exports = module.exports = parseInterp;
