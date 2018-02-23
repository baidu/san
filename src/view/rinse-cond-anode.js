/**
 * @file 清洗条件 aNode
 * @author errorrik(errorrik@gmail.com)
 */


var createANode = require('../parser/create-a-node');
var cloneDirectives = require('../parser/clone-directives');


/**
 * 清洗条件 aNode，返回纯净无条件指令的 aNode
 *
 * @param {ANode} condANode 节点对象
 * @return {ANode}
 */
function rinseCondANode(condANode) {
    var clearANode = createANode({
        children: condANode.children,
        props: condANode.props,
        events: condANode.events,
        tagName: condANode.tagName,
        vars: condANode.vars,
        directives: cloneDirectives(condANode.directives, {
            'if': 1,
            'else': 1,
            'elif': 1
        })
    });

    return clearANode;
}

exports = module.exports = rinseCondANode;
