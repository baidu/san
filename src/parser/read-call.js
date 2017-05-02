/**
 * @file 读取调用
 * @author errorrik(errorrik@gmail.com)
 */

var ExprType = require('./expr-type');
var readIdent = require('./read-ident');
var readTertiaryExpr = require('./read-tertiary-expr');

/**
 * 读取调用
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readCall(walker) {
    walker.goUntil();
    var ident = readIdent(walker);
    var args = [];

    if (walker.goUntil(40)) { // (
        while (!walker.goUntil(41)) { // )
            args.push(readTertiaryExpr(walker));
            walker.goUntil(44); // ,
        }
    }

    return {
        type: ExprType.CALL,
        name: ident,
        args: args
    };
}

exports = module.exports = readCall;
