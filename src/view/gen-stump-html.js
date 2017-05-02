/**
 * @file 创建桩的html
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 创建桩的html
 *
 * @param {Node} node 节点对象
 * @param {StringBuffer} buf html串存储对象
 */
function genStumpHTML(node, buf) {
    buf.push('<script type="text/san" id="' + node.id + '"></script>');
}

exports = module.exports = genStumpHTML;
