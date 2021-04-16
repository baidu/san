/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 读取字符串
 */


var ExprType = require('./expr-type');

/**
 * 读取字符串
 *
 * @param {Walker} walker 源码读取对象
 * @return {Object}
 */
function readString(walker) {
    var startCode = walker.currentCode();
    var value = "";
    var charCode;

    walkLoop: while ((charCode = walker.nextCode())) {
        switch (charCode) {
            case 92: // \
                charCode = walker.nextCode();

                switch (charCode) {
                    case 117: // \u
                        value += String.fromCharCode(parseInt(
                            walker.cut(walker.index + 1, walker.index + 5)
                        ), 16);
                        walker.go(4);
                        break;

                    case 120: // \x
                        value += String.fromCharCode(parseInt(
                            walker.cut(walker.index + 1, walker.index + 3)
                        ), 16);
                        walker.go(2);
                        break;

                    case 98:
                        value += '\b';
                        break;
                    case 102:
                        value += '\f';
                        break;
                    case 110:
                        value += '\n';
                        break;
                    case 114:
                        value += '\r';
                        break;
                    case 116:
                        value += '\t';
                        break;
                    case 118:
                        value += '\v';
                        break;

                    default:
                        value += String.fromCharCode(charCode);
                }

                break;
            case startCode:
                walker.go(1);
                break walkLoop;
            default:
                value += String.fromCharCode(charCode);
        }
    }

    return {
        type: ExprType.STRING,
        // 处理字符转义
        value: value
    };
}

exports = module.exports = readString;
