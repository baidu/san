function elementGetTransition(element) {
    var transitionDirective = element.aNode.directives.get('transition');

    var transition = element.transition;
    if (transitionDirective && element.owner) {
        transition = element.owner[transitionDirective.value] || transition;
    }

    return transition;
}

exports = module.exports = elementInitProps;
