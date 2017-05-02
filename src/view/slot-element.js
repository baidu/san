/**
 * @file slot元素类
 * @author errorrik(errorrik@gmail.com)
 */

var inherits = require('../util/inherits');
var each = require('../util/each');
var empty = require('../util/empty');
var Node = require('./node');
var Element = require('./element');
var TextNode = require('./text-node');
var ANode = require('../parser/a-node');
var genElementChildsHTML = require('./gen-element-childs-html');


/**
 * slot 元素类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function SlotElement(options) {
    this.childs = [];
    Node.call(this, options);
}

inherits(SlotElement, Node);

/**
 * 初始化行为
 *
 * @param {Object} options 初始化参数
 */
SlotElement.prototype._init = function (options) {
    var nameBind = options.aNode.props.get('name');
    this.name = nameBind ? nameBind.raw : '____';

    var literalOwner = options.owner;
    var givenSlots = literalOwner.aNode.givenSlots;
    var givenChilds = givenSlots && givenSlots[this.name];


    var aNode = new ANode();
    if (givenChilds) {
        aNode.childs = givenChilds;
        options.owner = literalOwner.owner;
        options.scope = literalOwner.scope;
    }
    else {
        aNode.childs = options.aNode.childs.slice(0);
    }

    options.aNode = aNode;
    Node.prototype._init.call(this, options);

    this.owner.slotChilds.push(this);
};

/**
 * 生成元素的html
 *
 * @param {StringBuffer} buf html串存储对象
 */
SlotElement.prototype.genHTML = function (buf) {
    genElementChildsHTML(this, buf);
};

/**
 * 隔离实际所属组件对其的视图更新调用。更新应由outer组件调用
 */
SlotElement.prototype.updateView = empty;

/**
 * 视图更新函数
 *
 * @param {Array} changes 数据变化信息
 */
SlotElement.prototype.slotUpdateView = function (changes) {
    each(this.childs, function (child) {
        child.updateView(changes);
    });
};

/**
 * 销毁释放元素行为
 */
SlotElement.prototype._dispose = function () {
    Element.prototype._disposeChilds.call(this);
    Node.prototype._dispose.call(this);
};

exports = module.exports = TextNode;
