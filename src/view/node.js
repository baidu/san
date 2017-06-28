/**
 * @file 节点基类
 * @author errorrik(errorrik@gmail.com)
 */

var each = require('../util/each');
var guid = require('../util/guid');
var LifeCycle = require('./life-cycle');
var evalExpr = require('../runtime/eval-expr');
var isComponent = require('./is-component');

/**
 * 节点基类
 *
 * @class
 * @param {Object} options 初始化参数
 * @param {ANode} options.aNode 抽象信息节点对象
 * @param {Component=} options.owner 所属的组件对象
 */
function Node(options) {
    this.lifeCycle = new LifeCycle();
    this.init(options || {});
}

/**
 * 使节点到达相应的生命周期
 *
 * @protected
 * @param {string} name 生命周期名称
 */
Node.prototype._toPhase = function (name) {
    this.lifeCycle.set(name);
};

/**
 * 初始化
 *
 * @param {Object} options 初始化参数
 */
Node.prototype.init = function (options) {
    this._init(options);
    this._toPhase('inited');
};

/**
 * 初始化行为
 *
 * @param {Object} options 初始化参数
 */
Node.prototype._init = function (options) {
    this.owner = options.owner;
    this.parent = options.parent;
    this.parentComponent = isComponent(this.parent)
        ? this.parent
        : this.parent && this.parent.parentComponent;

    this.scope = options.scope;
    this.aNode = this.aNode || options.aNode;
    this.el = options.el;

    this.id = (this.el && this.el.id)
        || (this.aNode && this.aNode.id)
        || guid();
};

/**
 * 获取节点对应的主元素
 *
 * @protected
 * @return {HTMLElement}
 */
Node.prototype._getEl = function () {
    if (!this.el) {
        this.el = document.getElementById(this.id);
    }

    return this.el;
};

/**
 * 通知自己和childs完成attached状态
 *
 * @protected
 */
Node.prototype._toAttached = function () {
    each(this.childs, function (child) {
        child._toAttached(true);
    });

    if (!this.lifeCycle.is('attached')) {
        if (isChild) {
            this._toPhase('created');
        }
        if (this._attached) {
            this._attached();
        }
        this._toPhase('attached');
    }
};

/**
 * 销毁释放元素
 */
Node.prototype.dispose = function () {
    this._dispose();
    this._toPhase('disposed');
};

/**
 * 销毁释放元素行为
 */
Node.prototype._dispose = function () {
    this.el = null;
    this.owner = null;
    this.scope = null;
    this.aNode = null;
    this.parent = null;
    this.parentComponent = null;
};

/**
 * 计算表达式的结果
 *
 * @param {Object} expr 表达式对象
 * @param {boolean} escapeInterpHtml 是否要对插值结果进行html转义
 * @return {*}
 */
Node.prototype.evalExpr = function (expr, escapeInterpHtml) {
    return evalExpr(expr, this.scope, this.owner, escapeInterpHtml);
};

exports = module.exports = Node;
