/**
 * @file 读取加法表达式
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('./expr-type');
var readMultiplicativeExpr = require('./read-multiplicative-expr');


/**
 * 读取加法表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readAdditiveExpr(walker) {
    var expr = readMultiplicativeExpr(walker);
    walker.goUntil();

    var code = walker.currentCode();
    switch (code) {
        case 43: // +
        case 45: // -
            walker.go(1);
            return {
                type: ExprType.BINARY,
                operator: code,
                segs: [expr, readAdditiveExpr(walker)]
            };
    }

    return expr;
}

exports = module.exports = readAdditiveExpr;
