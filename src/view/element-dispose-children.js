/**
 * @file 销毁释放元素的子元素
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 销毁释放元素的子元素
 *
 * @param {Object} element 元素节点
 * @param {Object} options 销毁节点的参数
 */
function elementDisposeChildren(element, noDetach, noTransition) {
    var children = element.children;
    var len = children && children.length;
    while (len--) {
        children[len].dispose(noDetach, noTransition);
    }
}

exports = module.exports = elementDisposeChildren;
