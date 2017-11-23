function elementLeaveTo(element, options) {
    var noTransition = options && options.noTransition;

    if (noTransition) {
        element._doneLeave();
    }
    else {
        var transition = elementGetTransition(element);
        var lifeCycle = element.lifeCycle;
        if (transition && !lifeCycle.leaving && lifeCycle.attached) {
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

exports = module.exports = elementLeaveTo;
