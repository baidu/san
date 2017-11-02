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
function elementDisposeChildren(element, dontDetach) {
    var children = element.children;
    if (children instanceof Array) {
        var len = children.length;
        while (len--) {
            children[len].dispose(dontDetach);
        }

        children.length = 0;
    }
}

exports = module.exports = elementDisposeChildren;
