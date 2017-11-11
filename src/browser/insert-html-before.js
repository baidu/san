/**
 * @file 在 DOM 之前插入 HTML
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 在 DOM 之前插入 HTML
 *
 * @param {string} html 要插入的html
 * @param {HTMLElement} parentEl 父元素
 * @param {HTMLElement?} beforeEl 在此元素之前插入
 */
function insertHTMLBefore(html, parentEl, beforeEl) {
    if (!beforeEl) {
        parentEl.insertAdjacentHTML('beforeend', html);
    }
    else if (beforeEl.nodeType !== 1) {
        var tempFlag = document.createElement('script');
        parentEl.insertBefore(tempFlag, beforeEl);
        tempFlag.insertAdjacentHTML('beforebegin', html);
        parentEl.removeChild(tempFlag);
    }
    else {
        beforeEl.insertAdjacentHTML('beforebegin', html);
    }
}



exports = module.exports = insertHTMLBefore;
