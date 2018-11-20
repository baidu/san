/**
 * @file 组件Loader类
 * @author errorrik(errorrik@gmail.com)
 */

var nextTick = require('../util/next-tick');
var each = require('../util/each');


/**
 * 组件Loader类
 *
 * @class
 *
 * @param {Object} options loader参数
 * @param {Function} options.load load方法
 * @param {Function=} options.loading loading过程中渲染的组件
 * @param {Function=} options.fallback load失败时渲染的组件
 */
function ComponentLoader(options) {
    this.load = options.load;
    this.placeholder = options;
    this.listeners = [];
}


/**
 * 开始加载组件
 */
ComponentLoader.prototype.start = function () {
    if (this.state) {
        return;
    }

    this.state = 1;
    var startLoad = this.load();
    var me = this;

    function done(RealComponent) {
        me.done(RealComponent);
    }

    if (startLoad && typeof startLoad.then === 'function') {
        startLoad.then(done, done);
    }
};

/**
 * 完成组件加载
 *
 * @param {Function=} ComponentClass 组件类
 */
ComponentLoader.prototype.done = function (ComponentClass) {
    this.state = 2;
    ComponentClass = ComponentClass || this.placeholder.fallback;
    this.Component = ComponentClass;

    each(this.listeners, function (listener) {
        listener(ComponentClass);
    });
};

/**
 * 监听组件加载完成
 *
 * @param {Function} listener 监听函数
 */
ComponentLoader.prototype.listen = function (listener) {
    if (this.state > 1) {
        var ComponentClass = this.Component;
        nextTick(function () {
            listener(ComponentClass);
        });
    }
    else {
        this.listeners.push(listener);
    }
};

exports = module.exports = ComponentLoader;
