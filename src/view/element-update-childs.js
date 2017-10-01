function elementUpdateChilds(element, changes, slotChildsName) {
    each(element.childs, function (child) {
        child.updateView(changes);
    });

    each(element[slotChildsName || 'slotChilds'], function (child) {
        elementUpdateChilds(child, changes);
    });
}

exports = module.exports = elementUpdateChilds;
