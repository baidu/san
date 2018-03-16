/**
 * @file 销毁释放元素
 * @author errorrik(errorrik@gmail.com)
 */

var elementDispose = require('./element-dispose');
var elementLeave = require('./element-leave');

/**
 * 销毁释放元素
 *
 * @param {Object=} options dispose行为参数
 */
function elementOwnDispose(noDetach, noTransition) {
    this.leaveDispose = 1;
    this.disposeNoDetach = noDetach;
    this.disposeNoTransition = noTransition;

    elementLeave(this);
}

exports = module.exports = elementOwnDispose;
