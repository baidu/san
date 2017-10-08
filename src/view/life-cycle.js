/**
 * @file 生命周期类
 * @author errorrik(errorrik@gmail.com)
 */

/* eslint-disable fecs-valid-var-jsdoc */
/**
 * 节点生命周期信息
 *
 * @inner
 * @type {Object}
 */
var LifeCycles = {
    compiled: {
        compiled: 1
    },

    inited: {
        compiled: 1,
        inited: 1
    },

    painting: {
        compiled: 1,
        inited: 1,
        painting: 1
    },

    created: {
        compiled: 1,
        inited: 1,
        created: 1
    },

    attached: {
        compiled: 1,
        inited: 1,
        created: 1,
        attached: 1
    },

    detached: {
        compiled: 1,
        inited: 1,
        created: 1,
        detached: 1
    },

    disposed: {
        disposed: 1
    }
};
/* eslint-enable fecs-valid-var-jsdoc */

/**
 * 生命周期类
 *
 * @class
 */
function LifeCycle() {
    this.raw = {};
}

/**
 * 设置生命周期
 *
 * @param {string} name 生命周期名称
 */
LifeCycle.prototype.set = function (name) {
    var phase = LifeCycles[name];

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
