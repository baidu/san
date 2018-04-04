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
    var match = walker.match(/\s*(-?[0-9]+(\.[0-9]+)?)/g);

    return {
        type: ExprType.NUMBER,
        value: match[1] - 0
    };
}

exports = module.exports = readNumber;
