/**
 * @file 创建桩的html
 * @author errorrik(errorrik@gmail.com)
 */

var pushStrBuffer = require('../runtime/push-str-buffer');

/**
 * 创建桩的html
 *
 * @param {Node} node 节点对象
 * @param {Object} buf html串存储对象
 */
function genStumpHTML(node, buf) {
    pushStrBuffer(buf, '<!--' + node.id + '-->');
}

exports = module.exports = genStumpHTML;
