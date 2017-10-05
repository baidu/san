/**
 * @file 初始化 element 节点
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 初始化 text 节点
 *
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 */
function elementInitTagName(node) {
    node.tagName = node.tagName || node.aNode.tagName || 'div';
    // ie8- 不支持innerHTML输出自定义标签
    if (ieOldThan9 && node.tagName.indexOf('-') > 0) {
        node.tagName = 'div';
    }

    // ie 下，如果 option 没有 value 属性，select.value = xx 操作不会选中 option
    // 所以没有设置 value 时，默认把 option 的内容作为 value
    if (node.tagName === 'option'
        && !node.aNode.props.get('value')
        && node.aNode.childs[0]
    ) {
        node.aNode.props.push({
            name: 'value',
            expr: node.aNode.childs[0].textExpr
        });
    }
}


exports = module.exports = elementInitTagName;