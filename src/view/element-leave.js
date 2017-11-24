/**
 * @file 元素节点执行leave行为
 * @author errorrik(errorrik@gmail.com)
 */

var elementGetTransition = require('./element-get-transition');


/**
 * 元素节点执行leave行为
 *
 * @param {Object} element 元素
 * @param {Object=} options 到达目标状态的参数
 */
function elementLeave(element, options) {
    var lifeCycle = element.lifeCycle;
    if (lifeCycle.leaving || !lifeCycle.attached) {
        return;
    }

    var noTransition = options && options.noTransition;

    if (noTransition) {
        element._doneLeave();
    }
    else {
        var transition = elementGetTransition(element);
        if (transition) {
            element._toPhase('leaving');
            transition.leave(element._getEl(), function () {
                element._doneLeave();
            });
        }
        else {
            element._doneLeave();
        }
    }
}

exports = module.exports = elementLeave;
