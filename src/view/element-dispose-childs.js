/**
 * @file 销毁释放元素的子元素
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 销毁释放元素的子元素
 *
 * @param {Object} element 元素节点
 * @param {boolean} dontDetach 是否不要将节点从DOM移除
 */
function elementDisposeChilds(element, dontDetach) {
    var childs = element.childs;
    if (childs instanceof Array) {
        var len = childs.length;
        while (len--) {
            childs[len].dispose(dontDetach);
        }

        childs.length = 0;
    }
}

exports = module.exports = elementDisposeChilds;
