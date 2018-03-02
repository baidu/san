/**
 * @file 模板解析生成的抽象节点
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 创建模板解析生成的抽象节点
 *
 * @param {Object=} options 节点参数
 * @param {string=} options.tagName 标签名
 * @param {ANode=} options.parent 父节点
 * @param {boolean=} options.textExpr 文本节点表达式对象
 * @return {Object}
 */
function createANode(options) {
    options = options || {};

    if (!options.textExpr) {
        options.directives = options.directives || {};
        options.props = options.props || [];
        options.events = options.events || [];
        options.children = options.children || [];
    }

    return options;
}

exports = module.exports = createANode;
