/**
 * @file 使元素节点到达相应的生命周期
 * @author errorrik(errorrik@gmail.com)
 */

var elementToPhase = require('./element-to-phase');

/**
 * 使元素节点到达相应的生命周期
 *
 * @param {string} name 生命周期名称
 */
function elementOwnToPhase(name) {
    elementToPhase(this, name);
}

exports = module.exports = elementOwnToPhase;
