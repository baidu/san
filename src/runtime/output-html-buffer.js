/**
 * @file 输出 HTML buffer 内容到 DOM 上
 * @author errorrik(errorrik@gmail.com)
 */

var isCompatStrJoin = require('../browser/is-compat-str-join');
var isCommentAutoClear = require('../browser/is-comment-auto-clear');
var insertBefore = require('../browser/insert-before');

/**
 * 输出 HTML buffer 内容到 DOM 上
 *
 * @param {Object} buf html字符串连接对象
 * @param {HTMLElement} target 目标DOM元素
 * @param {string?} pos 相对target的位置
 */
function outputHTMLBuffer(buf, target, pos) {
    // html 没内容就不要设置 innerHTML了
    // 这里还能避免在 IE 下 component root 为 input 等元素时设置 innerHTML 报错的问题
    var html = isCompatStrJoin ? buf.raw.join('') : buf.raw;
    if (!html) {
        return;
    }

    if (pos) {
        target.insertAdjacentHTML(pos, html);
    }
    else {
        target.innerHTML = html;
    }

    // 处理 ie 低版本下自动过滤 comment 的问题
    if (isCommentAutoClear) {
        var insertComments = buf.insertComments;
        var len = insertComments.length;

        while (len--) {
            var insertComment = insertComments[len];
            var commentNode = document.createComment(insertComment[0]);
            var insertParentEl = insertComment[1] ? document.getElementById(insertComment[1]) : null;
            var insertBeforeEl = null;

            if (insertParentEl) {
                insertBeforeEl = insertParentEl.firstChild;
            }
            else {
                switch (pos) {
                    case 'afterend':
                        insertParentEl = target.parentNode;
                        insertBeforeEl = target.nextSibling;
                        break;

                    case 'beforebegin':
                        insertParentEl = target.parentNode;
                        insertBeforeEl = target;
                        break;

                    case 'beforeend':
                        insertParentEl = target;
                        insertBeforeEl = null;
                        break;

                    default:
                        insertParentEl = target;
                        insertBeforeEl = insertParentEl.firstChild;
                }
            }

            insertBefore(commentNode, insertParentEl, insertBeforeEl);
        }
    }
}

exports = module.exports = outputHTMLBuffer;
