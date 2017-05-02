/**
 * @file 判断一个元素是不是桩
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 判断一个元素是不是桩
 *
 * @param {HTMLElement} element 要判断的元素
 * @return {boolean}
 */
function isStump(element) {
    return element.tagName === 'SCRIPT' && element.type === 'text/san';
}

exports = module.exports = isStump;
