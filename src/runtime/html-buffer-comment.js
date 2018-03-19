/**
 * @file 往html字符串连接对象中添加注释
 * @author errorrik(errorrik@gmail.com)
 */

var ieOldThan9 = require('../browser/ie-old-than-9');

/**
 * 往html字符串连接对象中添加注释
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} str 要添加的字符串
 */
var htmlBufferComment =
    // #[begin] allua
    ieOldThan9
        ?
        function (buf, str) {
            buf.raw[buf.length++] = '<!--' + str + '-->';
            if (buf.tagStart) {
                buf.insertComments.push([str, buf.tagId]);
            }
        }
        :
    // #[end]
        function (buf, str) {
            buf.raw += '<!--' + str + '-->';
        }
;

exports = module.exports = htmlBufferComment;
