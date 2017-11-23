/**
 * @file 销毁释放元素
 * @author errorrik(errorrik@gmail.com)
 */

var elementDispose = require('./element-dispose');

/**
 * 销毁释放元素
 *
 * @param {Object=} options dispose行为参数
 */
function elementOwnDispose(options) {
    var me = this;
    me._doneLeave = function () {
        if (!me.lifeCycle.disposed) {
            elementDispose(me, options);
            me._toPhase('disposed');
        }
    };

    elementLeaveTo(this, options);
}

exports = module.exports = elementOwnDispose;
