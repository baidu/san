/**
 * @file 销毁释放元素
 * @author errorrik(errorrik@gmail.com)
 */

var elementLeave = require('./element-leave');

/**
 * 销毁释放元素
 *
 * @param {boolean=} noDetach 是否不要把节点从dom移除
 * @param {boolean=} noTransition 是否不显示过渡动画效果
 */
function elementOwnDispose(noDetach, noTransition) {
    this.leaveDispose = 1;
    this.disposeNoDetach = noDetach;
    this.disposeNoTransition = noTransition;

    elementLeave(this);
}

exports = module.exports = elementOwnDispose;
