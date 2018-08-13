/**
 * @file 读取数字
 * @author errorrik(errorrik@gmail.com)
 */


var ExprType = require('./expr-type');

/**
 * 读取数字
 *
 * @inner
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readNumber(walker) {
    var match = walker.match(/\s*(-?[0-9]+(\.[0-9]+)?)/g, 1);

    if (match) {
        return {
            type: ExprType.NUMBER,
            value: +match[1]
        };
    }
    else if (walker.currentCode() === 45) {
        walker.go(1);
        return {
            type: ExprType.UNARY,
            expr: readUnaryExpr(walker),
            op: 45
        };
    }
}

exports = module.exports = readNumber;
