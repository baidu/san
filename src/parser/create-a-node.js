/**
 * @file 模板解析生成的抽象节点
 * @author errorrik(errorrik@gmail.com)
 */

var parseText = require('./parse-text');

/**
 * 创建模板解析生成的抽象节点
 *
 * @param {Object=} options 节点参数
 * @param {string=} options.tagName 标签名
 * @param {ANode=} options.parent 父节点
 * @param {boolean=} options.isText 是否文本节点
 * @return {Object}
 */
function createANode(options) {
    options = options || {};

    if (options.isText) {
        options.textExpr = parseText(options.text);
    }
    else {
        options.directives = options.directives || {};
        options.props = options.props || [];
        options.events = options.events || [];
        options.children = options.children || [];
    }

    return options;
}

exports = module.exports = createANode;
