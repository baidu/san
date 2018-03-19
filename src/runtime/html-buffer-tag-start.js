/**
 * @file 标记 HTML 字符串连接对象当前为 tag 起始位置
 * @author errorrik(errorrik@gmail.com)
 */

var ieOldThan9 = require('../browser/ie-old-than-9');
var empty = require('../util/empty');

/**
 * 标记 HTML 字符串连接对象当前为 tag 起始位置
 *
 * @param {Object} buf 字符串连接对象
 * @param {string} id 起始tag的id
 */
var htmlBufferTagStart =
    // #[begin] allua
    ieOldThan9
    ? function (buf, id) {
        buf.tagId = id;
        buf.tagStart = 1;
    }
    :
    // #[end]
    empty;

exports = module.exports = htmlBufferTagStart;
