function elementDisposeChilds(element, dontDetach) {
    var childs = element.childs;
    if (childs instanceof Array) {
        var len = childs.length;
        while (len--) {
            childs[len].dispose(dontDetach);
        }

        childs.length = 0;
    }
}

exports = module.exports = elementDisposeChilds;