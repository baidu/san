/**
 * @file 使节点到达相应的生命周期
 * @author errorrik(errorrik@gmail.com)
 */

var LifeCycle = require('./life-cycle');

/**
 * 使元素节点到达相应的生命周期
 *
 * @param {Object} element 元素节点
 * @param {string} name 生命周期名称
 * @return {boolean} 如果节点已经处于当前声明周期，返回false
 */
function elementToPhase(element, name) {
    if (element.lifeCycle[name]) {
        return;
    }

    element.lifeCycle = LifeCycle[name] || element.lifeCycle;

    return true;
}

exports = module.exports = elementToPhase;
