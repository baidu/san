/**
 * @file 使元素节点到达相应的生命周期
 * @author errorrik(errorrik@gmail.com)
 */


var LifeCycle = require('./life-cycle');

/**
 * 使元素节点到达相应的生命周期
 *
 * @param {string} name 生命周期名称
 */
function elementOwnToPhase(name) {
    this.lifeCycle = LifeCycle[name] || this.lifeCycle;
}

exports = module.exports = elementOwnToPhase;
