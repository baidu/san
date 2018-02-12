/**
 * @file 输出 HTML buffer 内容到 DOM 上
 * @author errorrik(errorrik@gmail.com)
 */

var outputHTMLBuffer = require('./output-html-buffer');

/**
 * 将 HTML buffer 内容插入到 DOM 节点之前
 *
 * @param {Object} buf html字符串连接对象
 * @param {HTMLElement} parentEl 父元素
 * @param {HTMLNode?} beforeEl 在此节点之前插入
 */
function outputHTMLBufferBefore(buf, parentEl, beforeEl) {
    if (beforeEl) {
        if (beforeEl.nodeType === 1) {
            outputHTMLBuffer(buf, beforeEl, 'beforebegin');
        }
        else {
            var tempFlag = document.createElement('script');
            parentEl.insertBefore(tempFlag, beforeEl);
            outputHTMLBuffer(buf, tempFlag, 'beforebegin');
            parentEl.removeChild(tempFlag);
        }
    }
    else {
        outputHTMLBuffer(buf, parentEl, 'beforeend');
    }
}

exports = module.exports = outputHTMLBufferBefore;
