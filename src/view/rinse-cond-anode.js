/**
 * @file 清洗条件 aNode
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 清洗条件 aNode，返回纯净无条件指令的 aNode
 *
 * @param {ANode} ifANode 节点对象
 * @return {ANode}
 */
function rinseCondANode(condANode) {
    var clearANode = createANode({
        children: condANode.children,
        props: condANode.props,
        events: condANode.events,
        tagName: condANode.tagName,
        vars: condANode.vars,
        directives: (new IndexedList()).concat(condANode.directives)
    });

    clearANode.directives.remove('if');
    clearANode.directives.remove('else');
    clearANode.directives.remove('elif');

    return clearANode;
}

exports = module.exports = rinseCondANode;
