/**
 * @file 添加子节点的 ANode
 * @author errorrik(errorrik@gmail.com)
 */

// #[begin] reverse
/**
 * 添加子节点的 ANode
 * 用于从 el 初始化时，需要将解析的元素抽象成 ANode，并向父级注册
 *
 * @param {ANode} aNode 抽象节点对象
 */
function elementOwnPushChildANode(aNode) {
    this.aNode.children.push(aNode);
}
// #[end]


exports = module.exports = elementOwnPushChildANode;
