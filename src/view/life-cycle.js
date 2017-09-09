/**
 * @file 生命周期类
 * @author errorrik(errorrik@gmail.com)
 */
var each = require('../util/each');

/* eslint-disable fecs-valid-var-jsdoc */
/**
 * 节点生命周期信息
 *
 * @inner
 * @type {Object}
 */
var LifeCycles = {
    compiled: {
        value: 1
    },

    inited: {
        value: 2
    },

    painting: {
        value: 3
    },

    created: {
        value: 4,
        mutex: 'painting'
    },

    attached: {
        value: 5,
        mutex: 'detached,painting'
    },

    detached: {
        value: 6,
        mutex: 'attached'
    },

    disposed: {
        value: 7,
        mutex: '*'
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
    var me = this;
    var lifeCycle = LifeCycles[name];
    if (!lifeCycle) {
        return;
    }

    if (lifeCycle.mutex === '*') {
        me.raw = {};
    }
    else if (lifeCycle.mutex) {
        each(lifeCycle.mutex.split(','), function (mutex) {
            me.raw[LifeCycles[mutex].value] = 0;
        }); 
    }

    me.raw[lifeCycle.value] = 1;
};

/**
 * 是否位于生命周期
 *
 * @param {string} name 生命周期名称
 * @return {boolean}
 */
LifeCycle.prototype.is = function (name) {
    var lifeCycle = LifeCycles[name];
    return lifeCycle && !!this.raw[lifeCycle.value];
};

exports = module.exports = LifeCycle;
