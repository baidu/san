/**
 * @file 使节点到达相应的生命周期
 * @author errorrik(errorrik@gmail.com)
 */


/**
 * 使节点到达相应的生命周期
 *
 * @param {string} name 生命周期名称
 */
function elementOwnToPhase(name) {
    this.lifeCycle = LifeCycle[name];
}

exports = module.exports = elementOwnToPhase;
