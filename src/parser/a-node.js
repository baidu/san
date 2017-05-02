/**
 * @file 模板解析生成的抽象节点
 * @author errorrik(errorrik@gmail.com)
 */

var IndexedList = require('../util/indexed-list');
var parseText = require('./parse-text');

/**
 * 模板解析生成的抽象节点
 *
 * @class
 * @param {Object=} options 节点参数
 * @param {string=} options.tagName 标签名
 * @param {ANode=} options.parent 父节点
 * @param {boolean=} options.isText 是否文本节点
 */
function ANode(options) {
    options = options || {};

    if (options.isText) {
        this.isText = 1;
        this.text = options.text;
        this.textExpr = parseText(options.text);
    }
    else {
        this.directives = options.directives || new IndexedList();
        this.props = options.props || new IndexedList();
        this.events = options.events || [];
        this.childs = options.childs || [];
        this.tagName = options.tagName;
        this.givenSlots = options.givenSlots;
        this.binds = options.binds;
    }

    this.parent = options.parent;
}

exports = module.exports = ANode;
