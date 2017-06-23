/**
 * @file 解析元素自身的 ANode
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var createANode = require('./create-a-node');
var integrateAttr = require('./integrate-attr');

// #[begin] reverse
/**
 * 解析元素自身的 ANode
 *
 * @param {HTMLElement} el 页面元素
 * @return {ANode}
 */
function parseANodeFromEl(el) {
    var aNode = createANode();
    aNode.tagName = el.tagName.toLowerCase();

    each(
        el.attributes,
        function (attr) {
            integrateAttr(aNode, attr.name, attr.value, 1);
        }
    );

    return aNode;
}
// #[end]

exports = module.exports = parseANodeFromEl;
