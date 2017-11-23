function elementToPhase(element, name) {
    if (element.lifeCycle[name]) {
        return;
    }

    element.lifeCycle = LifeCycle[name] || element.lifeCycle;

    var inFn = '_on' + name;
    if (typeof element[inFn] === 'function') {
        element[inFn](element);
    }

    if (typeof element[name] === 'function') {
        element[name](element);
    }

    return true;
}

exports = module.exports = elementToPhase;
