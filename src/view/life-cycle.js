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
    value: 1
};

LifeCycle.inited = {
    value: 2
};

LifeCycle.painting = {
    value: 3
};

LifeCycle.created = {
    value: 4,
    mutex: function (lifeCycle) {
        lifeCycle.raw[LifeCycle.painting.value] = 0;
    }
};

LifeCycle.attached = {
    value: 5,
    mutex: function (lifeCycle) {
        lifeCycle.raw[LifeCycle.painting.value] = 0;
        lifeCycle.raw[LifeCycle.detached.value] = 0;
    }
};

LifeCycle.detached = {
    value: 6,
    mutex: function (lifeCycle) {
        lifeCycle.raw[LifeCycle.attached.value] = 0;
    }
};

LifeCycle.disposed = {
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
LifeCycle.prototype.set = function (name) {
    var phase = LifeCycle[name];

    if (phase) {
        if (phase.mutex) {
            phase.mutex(this);
        }

        this.raw[phase.value] = 1;
    }
};

/**
 * 是否位于生命周期
 *
 * @param {string} name 生命周期名称
 * @return {boolean}
 */
LifeCycle.prototype.is = function (name) {
    var phase = LifeCycle[name];

    return phase && this.raw[phase.value];
};

exports = module.exports = LifeCycle;
