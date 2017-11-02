/**
 * @file 销毁释放元素
 * @author errorrik(errorrik@gmail.com)
 */

var elementDispose = require('./element-dispose');

/**
 * 销毁释放元素
 *
 * @param {boolean} dontDetach 是否不要将节点移除
 */
function elementOwnDispose(dontDetach) {
    if (!this.lifeCycle.disposed) {
        elementDispose(this, dontDetach);
        this._toPhase('disposed');
    }
}

exports = module.exports = elementOwnDispose;
