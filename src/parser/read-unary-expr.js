/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取一元表达式
 */

var ExprType = require('./expr-type');
var readString = require('./read-string');
var readNumber = require('./read-number');
var readCall = require('./read-call');
var readParenthesizedExpr = require('./read-parenthesized-expr');
var readTertiaryExpr = require('./read-tertiary-expr');


/**
 * 读取一元表达式
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readUnaryExpr(walker) {
    walker.goUntil();

    switch (walker.currentCode()) {
        case 33: // !
            walker.go(1);
            return {
                type: ExprType.UNARY,
                expr: readUnaryExpr(walker),
                operator: 33
            };

        case 34: // "
        case 39: // '
            return readString(walker);

        case 45: // -
        case 48: // number
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            return readNumber(walker);

        case 40: // (
            return readParenthesizedExpr(walker);

        // array literal
        case 91: // [
            walker.go(1);
            var arrItems = [];
            while (!walker.goUntil(93)) { // ]
                var item = {};
                arrItems.push(item);

                if (walker.currentCode() === 46 && walker.match(/\.\.\.\s*/g)) {
                    item.spread = true;
                }

                item.expr = readTertiaryExpr(walker);
                walker.goUntil(44); // ,
            }

            return {
                type: ExprType.ARRAY,
                items: arrItems
            };

        // object literal
        case 123: // {
            walker.go(1);
            var objItems = [];

            while (!walker.goUntil(125)) { // }
                var item = {};
                objItems.push(item);

                if (walker.currentCode() === 46 && walker.match(/\.\.\.\s*/g)) {
                    item.spread = true;
                    item.expr = readTertiaryExpr(walker);
                }
                else {
                    // #[begin] error
                    var walkerIndexBeforeName = walker.index;
                    // #[end]

                    item.name = readUnaryExpr(walker);

                    // #[begin] error
                    if (item.name.type > 4) {
                        throw new Error(
                            '[SAN FATAL] unexpect object name: '
                            + walker.cut(walkerIndexBeforeName, walker.index)
                        );
                    }
                    // #[end]

                    if (walker.goUntil(58)) { // :
                        item.expr = readTertiaryExpr(walker);
                    }
                    else {
                        item.expr = item.name;
                    }

                    if (item.name.type === ExprType.ACCESSOR) {
                        item.name = item.name.paths[0];
                    }
                }

                walker.goUntil(44); // ,
            }

            return {
                type: ExprType.OBJECT,
                items: objItems
            };
    }

    return readCall(walker);
}

exports = module.exports = readUnaryExpr;
