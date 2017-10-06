/**
 * @file 生命周期类
 * @author errorrik(errorrik@gmail.com)
 */

/**
 * 生命周期类
 *
 * @class
 */
function LifeCycle() {
    this.raw = {};
}

LifeCycle.compiled = {
    compiled: 1
};
LifeCycle.inited = {
    compiled: 1,
    inited: 1
};
LifeCycle.painting = {
    compiled: 1,
    inited: 1,
    painting: 1
};

LifeCycle.created = {
    compiled: 1,
    inited: 1,
    created: 1
};

LifeCycle.attached = {
    compiled: 1,
    inited: 1,
    created: 1,
    attached: 1
};

LifeCycle.detached = {
    compiled: 1,
    inited: 1,
    created: 1,
    detached: 1
};

LifeCycle.disposed = {
    disposed: 1
};

/**
 * 设置生命周期
 *
 * @param {string} name 生命周期名称
 */
LifeCycle.prototype.set = function (name) {
    var phase = LifeCycle[name];

    if (phase) {
        this.raw = phase;
    }
};

/**
 * 是否位于生命周期
 *
 * @param {string} name 生命周期名称
 * @return {boolean}
 */
LifeCycle.prototype.is = function (name) {
    return this.raw[name];
};

exports = module.exports = LifeCycle;
