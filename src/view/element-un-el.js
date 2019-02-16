function elementUnEl(element) {
    // el 事件解绑
    var len = element._elFns.length;
    while (len--) {
        var fn = element._elFns[len];
        un(element.el, fn[0], fn[1], fn[2]);
    }
    element._elFns = null;
}

exports = module.exports = elementUnEl;
