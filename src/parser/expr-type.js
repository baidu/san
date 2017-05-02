/**
 * @file 表达式类型
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 表达式类型
 *
 * @const
 * @type {Object}
 */
var ExprType = {
    STRING: 1,
    NUMBER: 2,
    ACCESSOR: 3,
    INTERP: 4,
    CALL: 5,
    TEXT: 6,
    BINARY: 7,
    UNARY: 8,
    TERTIARY: 9
};

exports = module.exports = ExprType;
