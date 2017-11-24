/**
 * @file 获取 element 的 transition 控制对象
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 获取 element 的 transition 控制对象
 *
 * @param {Object} element 元素
 * @return {Object?}
 */
function elementGetTransition(element) {
    var transitionDirective = element.aNode.directives.get('transition');

    var transition = element.transition;
    if (transitionDirective && element.owner) {
        transition = element.owner[transitionDirective.value] || transition;
    }

    return transition;
}

exports = module.exports = elementGetTransition;
