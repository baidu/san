/**
 * @file 获取 element 的 transition 控制对象
 * @author errorrik(errorrik@gmail.com)
 */

var evalArgs = require('../runtime/eval-args');
var findMethod = require('../runtime/find-method');
var NodeType = require('./node-type');

/**
 * 获取 element 的 transition 控制对象
 *
 * @param {Object} element 元素
 * @return {Object?}
 */
function elementGetTransition(element) {
    var aNode = element.nodeType === NodeType.CMPT ? element.givenANode : element.aNode;
    var directive = aNode && aNode.directives.transition;
    var owner = element.owner;

    var transition;
    if (directive && owner) {
        transition = findMethod(owner, directive.value.name);

        if (typeof transition === 'function') {
            transition = transition.apply(
                owner,
                evalArgs(directive.value.args, element.scope, owner)
            );
        }
    }

    return transition || element.transition;
}

exports = module.exports = elementGetTransition;
