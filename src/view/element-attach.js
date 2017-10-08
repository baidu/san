

var createStrBuffer = require('../runtime/create-str-buffer');
var stringifyStrBuffer = require('../runtime/stringify-str-buffer');

/**
 * 将元素attach到页面的行为
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
function elementAttach(element, parentEl, beforeEl) {
    element._create();
    if (parentEl) {
        if (beforeEl) {
            parentEl.insertBefore(element.el, beforeEl);
        }
        else {
            parentEl.appendChild(element.el);
        }
    }

    if (!element._contentReady) {
        var buf = createStrBuffer();
        genElementChildsHTML(element, buf);

        // html 没内容就不要设置 innerHTML了
        // 这里还能避免在 IE 下 component root 为 input 等元素时设置 innerHTML 报错的问题
        var html = stringifyStrBuffer(buf);
        if (html) {
            // #[begin] error
            warnSetHTML(element.el);
            // #[end]
            element.el.innerHTML = html;
        }

        element._contentReady = 1;
    }
}


exports = module.exports = elementAttach;
