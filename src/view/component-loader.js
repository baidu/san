/**
 * @file 组件Loader基类
 * @author errorrik(errorrik@gmail.com)
 */

var NodeType = require('./node-type');
var createReverseNode = require('./create-reverse-node');
var nodeOwnCreateStump = require('./node-own-create-stump');
var nodeOwnSimpleDispose = require('./node-own-simple-dispose');


/**
 * 组件Loader基类
 *
 * @class
 * @param {Object} options 初始化参数
 */
function ComponentLoader(options) {
    this.options = options;
    this.id = guid();
    this.children = [];

    // #[begin] reverse
    var reverseWalker = options.reverseWalker;
    if (reverseWalker) {
        var LoadingComponent = this.loading;
        if (LoadingComponent) {
            this.children[0] = new LoadingComponent(options);
        }

        this._create();
        insertBefore(this.el, reverseWalker.target, reverseWalker.current);

        this.start();
    }
    options.reverseWalker = null;
    // #[end]
}

ComponentLoader.prototype.nodeType = NodeType.LOADER;
ComponentLoader.prototype._create = nodeOwnCreateStump;
ComponentLoader.prototype.dispose = nodeOwnSimpleDispose;

/**
 * attach到页面
 *
 * @param {HTMLElement} parentEl 要添加到的父元素
 * @param {HTMLElement＝} beforeEl 要添加到哪个元素之前
 */
ComponentLoader.prototype.attach = function (parentEl, beforeEl) {
    var LoadingComponent = this.loading;
    if (LoadingComponent) {
        var component = new LoadingComponent(this.options);
        this.children[0] = component;
        component.attach(parentEl, beforeEl);
    }

    this._create();
    insertBefore(this.el, parentEl, beforeEl);

    this.start();
};

/**
 * 开始加载组件
 */
ComponentLoader.prototype.start = function () {
    var startLoad = this.load();
    var me = this;

    function finish(RealComponent) {
        me.done(RealComponent);
    }

    if (startLoad && typeof startLoad.then === 'function') {
        startLoad.then(finish, finish);
    }
};

/**
 * 完成组件加载，渲染组件
 *
 * @param {Function=} ComponentClass 组件类
 */
ComponentLoader.prototype.done = function (ComponentClass) {
    ComponentClass = ComponentClass || this.fallback;

    if (this.el && ComponentClass) {
        var component = new ComponentClass(this.options);
        component.attach(this.el.parentNode, this.el);

        var parentChildren = this.options.parent.children;
        var len = parentChildren.length;

        while (len--) {
            if (parentChildren[len] === this) {
                parentChildren[len] = component;
                break;
            }
        }
    }

    this.dispose();
};

exports = module.exports = ComponentLoader;
