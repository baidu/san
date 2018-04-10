/**
 * @file 判断元素是否不允许设置HTML
 * @author errorrik(errorrik@gmail.com)
 */

// some html elements cannot set innerHTML in old ie
// see: https://msdn.microsoft.com/en-us/library/ms533897(VS.85).aspx

/**
 * 判断元素是否不允许设置HTML
 *
 * @param {HTMLElement} el 要判断的元素
 * @return {boolean}
 */
function noSetHTML(el) {
    return /^(col|colgroup|frameset|style|table|tbody|tfoot|thead|tr|select)$/i.test(el.tagName);
}

exports = module.exports = noSetHTML;
