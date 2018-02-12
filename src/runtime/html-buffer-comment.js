/**
 * @file 往html字符串连接对象中添加注释
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');

/**
 * 往html字符串连接对象中添加注释
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} str 要添加的字符串
 */
var htmlBufferComment = isCompatStrJoin
    ? function (buf, str) {
        buf.raw[buf.length++] = '<!--' + str + '-->';
        if (buf.tagStart) {
            buf.insertComments.push([str, buf.tagId]);
        }
    }
    : function (buf, str) {
        buf.raw += '<!--' + str + '-->';
    };

exports = module.exports = htmlBufferComment;
