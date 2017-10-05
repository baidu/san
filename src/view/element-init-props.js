/**
 * 初始化 text 节点
 *
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 */
function elementInitProps(node) {
    node.lifeCycle = new LifeCycle();
    node.childs = [];
    node.slotChilds = [];
    node._elFns = {};
    node._propVals = {};
}


exports = module.exports = elementInitProps;
