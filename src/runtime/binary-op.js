/**
 * @file 二元表达式操作函数
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 二元表达式操作函数
 *
 * @type {Object}
 */
var BinaryOp = {
    /* eslint-disable */
    37: function (a, b) {
        return a % b;
    },
    43: function (a, b) {
        return a + b;
    },
    45: function (a, b) {
        return a - b;
    },
    42: function (a, b) {
        return a * b;
    },
    47: function (a, b) {
        return a / b;
    },
    60: function (a, b) {
        return a < b;
    },
    62: function (a, b) {
        return a > b;
    },
    76: function (a, b) {
        return a && b;
    },
    94: function (a, b) {
        return a != b;
    },
    121: function (a, b) {
        return a <= b;
    },
    122: function (a, b) {
        return a == b;
    },
    123: function (a, b) {
        return a >= b;
    },
    155: function (a, b) {
        return a !== b;
    },
    183: function (a, b) {
        return a === b;
    },
    248: function (a, b) {
        return a || b;
    }
    /* eslint-enable */
};

exports = module.exports = BinaryOp;
