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

LifeCycle.COMPILED = {
    value: 1
};

LifeCycle.INITED = {
    value: 2
};

LifeCycle.PAINTING = {
    value: 3
};

LifeCycle.CREATED = {
    value: 4,
    mutex: function (lifeCycle) {
        lifeCycle.raw[LifeCycle.PAINTING.value] = 0;
    }
};

LifeCycle.ATTACHED = {
    value: 5,
    mutex: function (lifeCycle) {
        lifeCycle.raw[LifeCycle.PAINTING.value] = 0;
        lifeCycle.raw[LifeCycle.DETACHED.value] = 0;
    }
};

LifeCycle.DETACHED = {
    value: 6,
    mutex: function (lifeCycle) {
        lifeCycle.raw[LifeCycle.ATTACHED.value] = 0;
    }
};

LifeCycle.DISPOSED = {
    value: 7,
    mutex: function (lifeCycle) {
        lifeCycle.raw = {};
    }
};

/**
 * 设置生命周期
 *
 * @param {string} name 生命周期名称
 */
LifeCycle.prototype.set = function (phase) {
    if (phase.mutex) {
        phase.mutex(this);
    }

    this.raw[phase.value] = 1;
};

/**
 * 是否位于生命周期
 *
 * @param {string} name 生命周期名称
 * @return {boolean}
 */
LifeCycle.prototype.is = function (phase) {
    return this.raw[phase.value];
};

exports = module.exports = LifeCycle;
