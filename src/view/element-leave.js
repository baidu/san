/**
 * @file 元素节点执行leave行为
 * @author errorrik(errorrik@gmail.com)
 */

var elementGetTransition = require('./element-get-transition');


/**
 * 元素节点执行leave行为
 *
 * @param {Object} element 元素
 */
function elementLeave(element) {
    var lifeCycle = element.lifeCycle;
    if (lifeCycle.leaving) {
        return;
    }

    if (element.disposeNoTransition) {
        element._doneLeave();
    }
    else {
        var transition = elementGetTransition(element);

        if (transition && transition.leave) {
            element._toPhase('leaving');
            transition.leave(element.el, function () {
                element._doneLeave();
            });
        }
        else {
            element._doneLeave();
        }
    }
}

exports = module.exports = elementLeave;
