/**
 * @file 生成子元素
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var createNode = require('./create-node');

/**
 * 生成子元素
 *
 * @param {Element} element 元素
 * @param {Object} buf html串存储对象
 */
function genElementChildren(element, parentEl, beforeEl) {
    parentEl = parentEl || element.el;
    var aNodeChildren = element.aNode.children;
    for (var i = 0; i < aNodeChildren.length; i++) {
        var child = createNode(aNodeChildren[i], element);
        element.children.push(child);
        child.attach(parentEl, beforeEl);
    }

}

exports = module.exports = genElementChildren;
