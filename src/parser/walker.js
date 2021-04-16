/**
 * Copyright (c) Baidu Inc. All rights reserved.
 *
 * This source code is licensed under the MIT license.
 * See LICENSE file in the project root for license information.
 *
 * @file 字符串源码读取类
 */


/**
 * 字符串源码读取类，用于模板字符串解析过程
 *
 * @class
 * @param {string} source 要读取的字符串
 */
function Walker(source) {
    this.source = source;
    this.len = this.source.length;
    this.index = 0;
}

/**
 * 读取下一个字符，返回下一个字符的 code
 *
 * @return {number}
 */
Walker.prototype.nextCode = function () {
    this.index++;
    return this.source.charCodeAt(this.index);
};

/**
 * 向前读取字符，直到遇到指定字符再停止
 * 未指定字符时，当遇到第一个非空格、制表符的字符停止
 *
 * @param {number=} charCode 指定字符的code
 * @return {boolean} 当指定字符时，返回是否碰到指定的字符
 */
Walker.prototype.goUntil = function (charCode) {
    var code;
    while (this.index < this.len && (code = this.source.charCodeAt(this.index))) {
        switch (code) {
            case 32: // 空格 space
            case 9: // 制表符 tab
            case 13: // \r
            case 10: // \n
                this.index++;
                break;

            default:
                if (code === charCode) {
                    this.index++;
                    return 1;
                }
                return;
        }
    }
};

/**
 * 向前读取符合规则的字符片段，并返回规则匹配结果
 *
 * @param {RegExp} reg 字符片段的正则表达式
 * @param {boolean} isMatchStart 是否必须匹配当前位置
 * @return {Array?}
 */
Walker.prototype.match = function (reg, isMatchStart) {
    reg.lastIndex = this.index;

    var match = reg.exec(this.source);
    if (match && (!isMatchStart || this.index === match.index)) {
        this.index = reg.lastIndex;
        return match;
    }
};

exports = module.exports = Walker;
