function elementLeaveTo(element, options) {
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

exports = module.exports = elementLeaveTo;
